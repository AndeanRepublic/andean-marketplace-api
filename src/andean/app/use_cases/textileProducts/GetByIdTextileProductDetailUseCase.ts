import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import {
	TextileProductDetailResponse,
	TraceabilityInfoResponse,
} from '../../modules/textile/TextileProductDetailResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { ReviewRepository } from '../../datastore/Review.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { Review } from 'src/andean/domain/entities/Review';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { TextileProductAttributesAssembler } from '../../../infra/services/textileProducts/TextileProductAttributesAssembler';
import { MediaUrlResolver } from '../../../infra/services/textileProducts/MediaUrlResolver';
import { TraceabilityProcessName } from '../../../domain/enums/TraceabilityProcessName';

@Injectable()
export class GetByIdTextileProductDetailUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly textileProductAttributesAssembler: TextileProductAttributesAssembler,
	) {}

	async handle(id: string): Promise<TextileProductDetailResponse> {
		// -- Obtener el producto principal
		const product =
			await this.textileProductRepository.getTextileProductById(id);
		if (!product) {
			throw new NotFoundException('Textile product not found');
		}

		// -- Obtener media items del producto
		const mediaItems = await this.mediaItemRepository.getByIds(
			product.baseInfo.mediaIds || [],
		);
		const images = mediaItems.map((mediaItem) => ({
			name: mediaItem.name,
			role: mediaItem.role,
			url: `${process.env.STORAGE_BASE_URL || ''}/${mediaItem.key}`,
		}));

		// -- Obtener reviews del producto
		const reviews = await this.reviewRepository.getByProductIdAndType(
			id,
			ProductType.TEXTILE,
		);

		// -- Obtener customers para las reviews y sus nombres de Account
		const customerPromises = reviews.map((review) =>
			this.customerProfileRepository.getCustomerById(review.customerId),
		);
		const customers = await Promise.all(customerPromises);

		const accountPromises = customers.map((customer) =>
			customer
				? this.accountRepository.getAccountByUserId(customer.userId)
				: Promise.resolve(null),
		);
		const accounts = await Promise.all(accountPromises);

		// -- Calcular estadísticas de ratings
		const ratingStats = this.calculateRatingStats(reviews);

		// -- Mapear comments de reviews
		const comments = reviews.map((review, index) => ({
			idReview: review.id,
			nameUser: accounts[index]?.name || 'Usuario Anónimo',
			content: review.content,
			numberStarts: review.numberStarts,
			date: review.createdAt,
			likes: review.numberLikes,
			dislikes: review.numberDislikes,
		}));

		// -- Obtener variants del producto
		const variants = await this.variantRepository.getByProductId(product.id);
		const { variantInfo } =
			await this.textileProductAttributesAssembler.buildForProduct(
				product,
				variants,
			);

		// -- Agrupar traceability epochs y agregar blockchainLink
		const groupedEpochs = this.groupTraceabilityEpochs(
			product.productTraceability?.epochs || [],
		);
		const traceabilityInfo: TraceabilityInfoResponse = {
			origen: groupedEpochs.origen as TraceabilityInfoResponse['origen'],
			processing:
				groupedEpochs.processing as TraceabilityInfoResponse['processing'],
			development:
				groupedEpochs.development as TraceabilityInfoResponse['development'],
			merchandising:
				groupedEpochs.merchandising as TraceabilityInfoResponse['merchandising'],
			...(product.productTraceability?.blockchainLink && {
				blockchainLink: product.productTraceability.blockchainLink,
			}),
		};

		// -- Obtener productos similares
		const similarProducts = await this.getSimilarProducts(
			product.id,
			product.categoryId,
		);

		// -- Obtener communityInfo si es COMMUNITY
		let communityInfo:
			| {
					bannerImageId: string;
					name: string;
					seals: { title: string; description: string; logoMediaId: string }[];
			  }
			| undefined = undefined;
		if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
			const community = await this.communityRepository.getById(
				product.baseInfo.ownerId,
			);
			if (community) {
				const seals = community.seals
					? await Promise.all(
							community.seals.map((sealId) =>
								this.sealRepository.getById(sealId),
							),
						)
					: [];

				communityInfo = {
					bannerImageId: community.bannerImageId,
					name: community.name,
					seals: seals
						.filter((seal): seal is NonNullable<typeof seal> => seal !== null)
						.map((seal) => ({
							title: seal.name,
							description: seal.description,
							logoMediaId: seal.logoMediaId,
						})),
				};
			}
		}

		// -- Obtener category name
		let categoryName = '';
		if (product.categoryId) {
			const category = await this.textileCategoryRepository.getCategoryById(
				product.categoryId,
			);
			categoryName = category?.name || '';
		}

		// -- Construir respuesta completa
		return {
			id: product.id,
			title: product.baseInfo.title,
			images,
			variantInfo,
			generalStock: product.priceInventary.totalStock,
			basePrice: product.priceInventary.basePrice,
			information: product.baseInfo.information || '',
			description: product.baseInfo.description,
			traceabilityInfo,
			reviews: {
				rating: ratingStats,
				comments,
			},
			similarProducts,
			...(communityInfo && { communityInfo }),
		};
	}

	private calculateRatingStats(reviews: Review[]) {
		const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
		let totalStars = 0;

		reviews.forEach((review) => {
			const stars = review.numberStarts;
			if (stars >= 1 && stars <= 5) {
				counts[stars as keyof typeof counts]++;
				totalStars += stars;
			}
		});

		const totalReviews = reviews.length;
		const averagePunctuation = totalReviews > 0 ? totalStars / totalReviews : 0;

		return {
			count5stars: counts[5],
			count4stars: counts[4],
			count3stars: counts[3],
			count2stars: counts[2],
			count1star: counts[1],
			totalReviews,
			averagePunctuation: Math.round(averagePunctuation * 10) / 10, // Redondear a 1 decimal
		};
	}

	private groupTraceabilityEpochs(
		epochs: {
			title: string;
			country: string;
			city: string;
			description: string;
			processName: string;
			supplier: string;
		}[],
	) {
		const grupos: Record<string, unknown[]> = {
			origen: [],
			processing: [],
			development: [],
			merchandising: [],
		};

		const stepData = (
			epoch: (typeof epochs)[0],
		): {
			title: string;
			supplier: string;
			country: string;
			city: string;
			description: string;
		} => ({
			title: epoch.title,
			supplier: epoch.supplier,
			country: epoch.country,
			city: epoch.city,
			description: epoch.description,
		});

		const keyMap: Record<TraceabilityProcessName, keyof typeof grupos> = {
			[TraceabilityProcessName.ORIGIN]: 'origen',
			[TraceabilityProcessName.PROCESSING]: 'processing',
			[TraceabilityProcessName.DEVELOPMENT]: 'development',
			[TraceabilityProcessName.MERCHANDISING]: 'merchandising',
		};

		epochs.forEach((epoch) => {
			const key = keyMap[epoch.processName as TraceabilityProcessName];
			if (key) {
				grupos[key].push(stepData(epoch));
			}
		});

		return grupos;
	}

	private async getSimilarProducts(
		currentProductId: string,
		categoryId?: string,
	): Promise<
		{
			id: string;
			title: string;
			categoryName: string;
			productorName: string;
			variantInfo: {
				variantId: string;
				size: string;
				color: { color: string; hexCode: string; imgUrl?: string };
				material: string;
				price: number;
				stock: number;
			}[];
			principalImgUrl: string;
			price: number;
			stock: number;
		}[]
	> {
		if (!categoryId) {
			return [];
		}

		const allProducts =
			await this.textileProductRepository.getAllTextileProducts();
		const similarProducts = allProducts.filter(
			(p) => p.id !== currentProductId && p.categoryId === categoryId,
		);
		const limitedProducts = similarProducts.slice(0, 5);

		if (limitedProducts.length === 0) {
			return [];
		}

		const category =
			await this.textileCategoryRepository.getCategoryById(categoryId);

		const allVariants = (
			await Promise.all(
				limitedProducts.map((p) => this.variantRepository.getByProductId(p.id)),
			)
		).flat();

		const attributesByProductId =
			await this.textileProductAttributesAssembler.buildForProducts(
				limitedProducts.map((p) => ({ id: p.id, options: p.options })),
				allVariants,
			);

		const mappedProducts = await Promise.all(
			limitedProducts.map(async (product) => {
				let productorName = '';
				if (product.baseInfo.ownerType === OwnerType.SHOP) {
					const shop = await this.shopRepository.getById(
						product.baseInfo.ownerId,
					);
					productorName = shop?.name || '';
				} else if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
					const community = await this.communityRepository.getById(
						product.baseInfo.ownerId,
					);
					productorName = community?.name || '';
				}

				const attrs = attributesByProductId.get(product.id) || {
					variantInfo: [],
				};

				return {
					id: product.id,
					title: product.baseInfo.title,
					categoryName: category?.name || '',
					productorName,
					variantInfo: attrs.variantInfo,
					principalImgUrl: product.baseInfo.mediaIds?.[0] || '',
					price: product.priceInventary.basePrice,
					stock: product.priceInventary.totalStock,
				};
			}),
		);

		const mediaIds = mappedProducts
			.map((p) => p.principalImgUrl)
			.filter((id): id is string => Boolean(id));
		const mediaIdToUrl = await this.mediaUrlResolver.resolveUrls(mediaIds);

		return mappedProducts.map((p) => ({
			...p,
			principalImgUrl: p.principalImgUrl
				? (mediaIdToUrl.get(p.principalImgUrl) ?? '')
				: '',
		}));
	}
}

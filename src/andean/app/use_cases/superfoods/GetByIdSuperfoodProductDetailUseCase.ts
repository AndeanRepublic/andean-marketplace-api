import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodBenefitRepository } from '../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodNutritionalFeatureRepository } from '../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { ReviewRepository } from '../../datastore/Review.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { ProductType } from '../../../domain/enums/ProductType';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';
import { Review } from '../../../domain/entities/Review';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import {
	SuperfoodProductDetailResponse,
	MediaImageResponse,
	TraceabilityInfoResponse,
	ReviewsResponse,
	SuperfoodProductListItemCompact,
} from '../../modules/superfoods/SuperfoodProductDetailResponse';
import { SuperfoodProductListItem } from '../../modules/superfoods/SuperfoodProductListItem';

@Injectable()
export class GetByIdSuperfoodProductDetailUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SuperfoodBenefitRepository)
		private readonly superfoodBenefitRepository: SuperfoodBenefitRepository,
		@Inject(SuperfoodNutritionalFeatureRepository)
		private readonly superfoodNutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		@Inject(DetailSourceProductRepository)
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) {}

	async handle(productId: string): Promise<SuperfoodProductDetailResponse> {
		// 1. Obtener producto principal
		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!product) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		// 2. Lanzar consultas independientes en paralelo para mejor rendimiento
		const [mediaItems, reviews, nutritionalFeatures, benefits, sourceProduct] =
			await Promise.all([
				this.mediaItemRepository.getByIds(product.baseInfo.mediaIds || []),
				this.reviewRepository.getByProductIdAndType(
					productId,
					ProductType.SUPERFOOD,
				),
				this.superfoodNutritionalFeatureRepository.getByIds(
					product.baseInfo.nutritional_features || [],
				),
				this.superfoodBenefitRepository.getByIds(
					product.baseInfo.benefits || [],
				),
				product.detailSourceProductId
					? this.detailSourceProductRepository.getById(
							product.detailSourceProductId,
						)
					: Promise.resolve(null),
			]);

		// 3. Resolver imágenes por rol
		const images = this.resolveImages(mediaItems);

		// 4. Resolver owner y reviews en paralelo
		const [ownerInfo, reviewsResponse] = await Promise.all([
			this.resolveOwner(product),
			this.buildReviews(reviews),
		]);

		// 5. Resolver nutritional features con iconos (batch de mediaIds)
		const featureIconIds = nutritionalFeatures
			.map((f) => f.iconId)
			.filter((id): id is string => !!id);
		const benefitIconIds = benefits
			.map((b) => b.iconId)
			.filter((id): id is string => !!id);
		const allIconIds = [...new Set([...featureIconIds, ...benefitIconIds])];
		const iconMediaItems =
			allIconIds.length > 0
				? await this.mediaItemRepository.getByIds(allIconIds)
				: [];
		const iconMap = new Map(iconMediaItems.map((m) => [m.id, m.key]));

		// 6. Mapear nutritional features para hero
		const nutritionalFeaturesInfo = nutritionalFeatures.map((f) => ({
			id: f.id,
			name: f.name,
			iconUrl: f.iconId ? iconMap.get(f.iconId) || '' : '',
		}));

		// 7. Mapear benefits
		const benefitsInfo = benefits.map((b) => ({
			id: b.id,
			name: b.name,
			iconUrl: b.iconId ? iconMap.get(b.iconId) || '' : '',
			description: b.description || undefined,
			color: b.color || '',
		}));

		// 8. Mapear nutritional content — separar striking vs normal
		const strikingNutritionalItems = (product.nutritionalContent || [])
			.filter((item) => item.selected)
			.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				name: item.nutrient,
				strikingFeature: item.strikingFeature,
			}));

		const nutritionalInformation = (product.nutritionalContent || []).map(
			(item) => ({
				id: item.id,
				quantity: item.quantity,
				name: item.nutrient,
			}),
		);

		// 9. Traceability
		const traceabilityInfo = this.buildTraceabilityInfo(product);

		// 10. More products (6 primeros, excluyendo el actual)
		const moreProducts = await this.getMoreProducts(productId);

		// 11. Source product info
		const sourceProductInfo = sourceProduct
			? {
					name: sourceProduct.name,
					description: sourceProduct.description,
					features: sourceProduct.features,
				}
			: { name: '', description: '', features: [] };

		// 12. Construir respuesta
		return {
			id: product.id,
			mainImg: images.mainImg,
			plateImg: images.plateImg,
			sourceProductImg: images.sourceProductImg,
			heroDetail: {
				title: product.baseInfo.title,
				description: product.baseInfo.description,
				nutritionalFeatures: nutritionalFeaturesInfo,
				basePrice: product.priceInventory.basePrice,
				totalStock: product.priceInventory.totalStock,
				isDiscountActive: product.isDiscountActive,
				traceabilityInfo,
			},
			owner: ownerInfo,
			benefitsInfo,
			sourceProductInfo,
			strikingNutritionalItems,
			nutritionalInformation,
			moreProducts,
			reviews: reviewsResponse,
		};
	}

	// ── Private helpers ──────────────────────────────────────────────────

	private resolveImages(mediaItems: MediaItem[]): {
		mainImg: MediaImageResponse;
		plateImg: MediaImageResponse;
		sourceProductImg: MediaImageResponse;
	} {
		const principal = mediaItems.find(
			(m) => m.role === MediaItemRole.PRINCIPAL,
		);
		const secondary = mediaItems.find(
			(m) => m.role === MediaItemRole.SECUNDARY,
		);
		const none = mediaItems.find((m) => m.role === MediaItemRole.NONE);

		const toImage = (m?: MediaItem): MediaImageResponse => ({
			name: m?.name || '',
			url: m?.key || '',
		});

		return {
			mainImg: toImage(principal),
			plateImg: toImage(secondary),
			sourceProductImg: toImage(none),
		};
	}

	private async resolveOwner(
		product: SuperfoodProduct,
	): Promise<{ id: string; type: string; name: string; imgUrl: string }> {
		const ownerType = product.baseInfo.ownerType;
		const ownerId = product.baseInfo.ownerId;

		if (ownerType === 'COMMUNITY') {
			const community = await this.communityRepository.getById(ownerId);
			let imgUrl = '';
			if (community?.bannerImageId) {
				const bannerMedia = await this.mediaItemRepository.getById(
					community.bannerImageId,
				);
				imgUrl = bannerMedia?.key || '';
			}
			return {
				id: ownerId,
				type: ownerType,
				name: community?.name || '',
				imgUrl,
			};
		}

		// SHOP
		const shop = await this.shopRepository.getById(ownerId);
		return {
			id: ownerId,
			type: ownerType,
			name: shop?.name || '',
			imgUrl: '',
		};
	}

	private async buildReviews(reviews: Review[]): Promise<ReviewsResponse> {
		// Obtener customers y accounts en paralelo
		const customers = await Promise.all(
			reviews.map((r) =>
				this.customerProfileRepository.getCustomerById(r.customerId),
			),
		);
		const accounts = await Promise.all(
			customers.map((c) =>
				c
					? this.accountRepository.getAccountByUserId(c.userId)
					: Promise.resolve(null),
			),
		);

		const ratingStats = this.calculateRatingStats(reviews);
		const comments = reviews.map((review, i) => ({
			idReview: review.id,
			nameUser: accounts[i]?.name || 'Usuario Anónimo',
			content: review.content,
			numberStarts: review.numberStarts,
			date: review.createdAt,
			likes: review.numberLikes,
			dislikes: review.numberDislikes,
		}));

		return { rating: ratingStats, comments };
	}

	private calculateRatingStats(reviews: Review[]) {
		const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
		let totalStars = 0;

		reviews.forEach((r) => {
			const s = r.numberStarts;
			if (s >= 1 && s <= 5) {
				counts[s as keyof typeof counts]++;
				totalStars += s;
			}
		});

		const totalReviews = reviews.length;
		const avg = totalReviews > 0 ? totalStars / totalReviews : 0;

		return {
			count5stars: counts[5],
			count4stars: counts[4],
			count3stars: counts[3],
			count2stars: counts[2],
			count1star: counts[1],
			totalReviews,
			averagePunctuation: Math.round(avg * 10) / 10,
		};
	}

	private buildTraceabilityInfo(
		product: SuperfoodProduct,
	): TraceabilityInfoResponse {
		const epochs = product.productTraceability?.epochs || [];
		const groups: TraceabilityInfoResponse = {
			...(product.productTraceability?.blockchainLink && {
				blockchainLink: product.productTraceability.blockchainLink,
			}),
			origen: [],
			processing: [],
			development: [],
			merchandising: [],
		};

		const arrayKeys = ['origen', 'processing', 'development', 'merchandising'] as const;
		const keyMap: Record<string, (typeof arrayKeys)[number]> = {
			origin: 'origen',
			processing: 'processing',
			development: 'development',
			merchandising: 'merchandising',
		};

		for (const epoch of epochs) {
			const key = keyMap[epoch.processName as string];
			if (key) {
				groups[key]!.push({
					title: epoch.title,
					supplier: epoch.supplier,
					country: epoch.country,
					city: epoch.city,
					description: epoch.description,
				});
			}
		}

		return groups;
	}

	private async getMoreProducts(
		currentProductId: string,
	): Promise<SuperfoodProductListItemCompact[]> {
		// Reutilizar el método del repo que ya hace el aggregation optimizado
		const { products } =
			await this.superfoodProductRepository.getAllWithFilters({
				page: 1,
				perPage: 7, // Pedir 7 para poder excluir el actual y aún tener 6
			});

		return products
			.filter((p) => p.id !== currentProductId)
			.slice(0, 6)
			.map((p) => ({
				id: p.id,
				color: p.color,
				title: p.title,
				ownerName: p.ownerName,
				price: p.price,
				totalStock: p.totalStock,
				mainImage: p.mainImage,
				sourceProductImage: p.sourceProductImage,
				nutritionItems: p.nutritionItems,
			}));
	}
}

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
import { collectSuperfoodProductMediaIds } from '../../../domain/superfoods/collectSuperfoodProductMediaIds';
import { Review } from '../../../domain/entities/Review';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import {
	SuperfoodProductDetailResponse,
	MediaImageResponse,
	ReviewsResponse,
	SuperfoodProductListItemCompact,
} from '../../models/superfoods/SuperfoodProductDetailResponse';
import type { ProductTraceabilityResponse } from '../../models/shared/ProductTraceabilityResponse';
import { SuperfoodProductListItem } from '../../models/superfoods/SuperfoodProductListItem';
import { OwnerInfoResolver } from '../../../infra/services/owner/OwnerInfoResolver';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { SuperfoodProductListColorResolver } from '../../../infra/services/superfood/SuperfoodProductListColorResolver';
import { SuperfoodProductListMediaResolver } from '../../../infra/services/superfood/SuperfoodProductListMediaResolver';
import { instanceToPlain } from 'class-transformer';

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
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly ownerInfoResolver: OwnerInfoResolver,
		private readonly superfoodProductListColorResolver: SuperfoodProductListColorResolver,
		private readonly superfoodProductListMediaResolver: SuperfoodProductListMediaResolver,
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
				this.mediaItemRepository.getByIds(
					collectSuperfoodProductMediaIds(product.baseInfo.productMedia),
				),
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

		// 3. Resolver imágenes por IDs en productMedia
		const images = await this.resolveProductImages(product, mediaItems);

		// 4. Resolver owner, reviews y color de catálogo en paralelo
		const [ownerInfo, reviewsResponse, catalogColor] = await Promise.all([
			this.ownerInfoResolver.resolveDetailed(
				String(product.baseInfo.ownerType),
				product.baseInfo.ownerId,
			),
			this.buildReviews(reviews),
			this.superfoodProductListColorResolver.resolveById(product.colorId),
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
		const iconUrlById = await this.mediaUrlResolver.resolveUrls(
			iconMediaItems.map((m) => m.id),
		);

		// 6. Mapear nutritional features para hero (iconUrl = URL pública del media)
		const nutritionalFeaturesInfo = nutritionalFeatures.map((f) => ({
			id: f.id,
			name: f.name,
			iconUrl: f.iconId ? iconUrlById.get(f.iconId) || '' : '',
		}));

		// 7. Mapear benefits
		const benefitsInfo = benefits.map((b) => ({
			id: b.id,
			name: b.name,
			iconUrl: b.iconId ? iconUrlById.get(b.iconId) || '' : '',
			description: b.description || undefined,
			color: b.hexCodeColor || '',
		}));

		// 8. Mapear nutritional content — separar striking vs normal
		const servingNutritionItems =
			product.servingNutrition?.servingNutritionalContent || [];
		const strikingNutritionalItems = servingNutritionItems
			.filter((item) => item.selected)
			.map((item) => ({
				quantityNumber: item.quantityNumber,
				quantityUnit: item.quantityUnit,
				name: item.nutrient,
				strikingFeature: item.strikingFeature,
			}));

		const nutritionalInformation = servingNutritionItems.map((item) => ({
			quantityNumber: item.quantityNumber,
			quantityUnit: item.quantityUnit,
			name: item.nutrient,
		}));

		// 9. More products (6 primeros, excluyendo el actual)
		const moreProducts = await this.getMoreProducts(productId);

		// 10. Source product info
		const sourceProductInfo = sourceProduct
			? {
					name: sourceProduct.name,
					description: sourceProduct.description,
					features: sourceProduct.features,
				}
			: { name: '', description: '', features: [] };

		// 11. Construir respuesta
		return {
			id: product.id,
			mainImg: images.mainImg,
			plateImg: images.plateImg,
			sourceProductImg: images.sourceProductImg,
			...(images.closestSourceProductImg.url ||
			images.closestSourceProductImg.name
				? { closestSourceProductImg: images.closestSourceProductImg }
				: {}),
			...(images.otherProductImages.length
				? { otherProductImages: images.otherProductImages }
				: {}),
			heroDetail: {
				title: product.baseInfo.title,
				...(product.baseInfo.shortDescription?.trim() && {
					shortDescription: product.baseInfo.shortDescription.trim(),
				}),
				description: product.baseInfo.detailedDescription,
				nutritionalFeatures: nutritionalFeaturesInfo,
				basePrice: product.priceInventory.basePrice,
				totalStock: product.priceInventory.totalStock,
				isDiscountActive: product.isDiscountActive,
			},
			...(ownerInfo && { ownerInfo }),
			benefitsInfo,
			sourceProductInfo,
			strikingNutritionalItems,
			nutritionalInformation,
			moreProducts,
			reviews: reviewsResponse,
			...(catalogColor && { color: catalogColor }),
			status: product.status,
			...(product.productTraceability && {
				productTraceability: instanceToPlain(
					product.productTraceability,
				) as ProductTraceabilityResponse,
			}),
			isDiscountActive: product.isDiscountActive,
		};
	}

	// ── Private helpers ──────────────────────────────────────────────────

	private async resolveProductImages(
		product: SuperfoodProduct,
		mediaItems: MediaItem[],
	): Promise<{
		mainImg: MediaImageResponse;
		plateImg: MediaImageResponse;
		sourceProductImg: MediaImageResponse;
		closestSourceProductImg: MediaImageResponse;
		otherProductImages: MediaImageResponse[];
	}> {
		const pm = product.baseInfo.productMedia;
		const byId = new Map(mediaItems.map((m) => [m.id, m]));
		const mediaUrlById = await this.mediaUrlResolver.resolveUrls(
			mediaItems.map((item) => item.id),
		);

		const toImage = (id?: string): MediaImageResponse => {
			const m = id ? byId.get(id) : undefined;
			return {
				name: m?.name || '',
				url: m?.id ? mediaUrlById.get(m.id) || '' : '',
			};
		};

		const otherProductImages = (pm.otherImagesId ?? [])
			.map((id) => toImage(id))
			.filter((img) => img.url || img.name);

		return {
			mainImg: toImage(pm.mainImgId),
			plateImg: toImage(pm.plateImgId),
			sourceProductImg: toImage(pm.sourceProductImgId),
			closestSourceProductImg: toImage(pm.closestSourceProductImgId),
			otherProductImages,
		};
	}

	private async buildReviews(reviews: Review[]): Promise<ReviewsResponse> {
		// Obtener accounts directamente
		const accounts = await Promise.all(
			reviews.map((r) => this.accountRepository.getAccountById(r.accountId)),
		);

		const ratingStats = this.calculateRatingStats(reviews);
		const comments = reviews.map((review, i) => ({
			idReview: review.id,
			nameUser: accounts[i]?.name || 'Usuario Anónimo',
			content: review.content,
			numberStars: review.numberStars,
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
			const s = r.numberStars;
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

	private async getMoreProducts(
		currentProductId: string,
	): Promise<SuperfoodProductListItemCompact[]> {
		// Reutilizar el método del repo que ya hace el aggregation optimizado
		const { products: rawProducts } =
			await this.superfoodProductRepository.getAllWithFilters({
				page: 1,
				perPage: 7, // Pedir 7 para poder excluir el actual y aún tener 6
			});

		const withMedia =
			await this.superfoodProductListMediaResolver.attachListMediaFromAggregate(
				rawProducts,
			);
		const products =
			await this.superfoodProductListColorResolver.attachCatalogColorFromAggregate(
				withMedia,
			);

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

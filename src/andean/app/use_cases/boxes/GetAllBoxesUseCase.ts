import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import {
	BoxListPaginatedResponse,
	BoxListItemResponse,
	BoxListProductResponse,
} from '../../models/box/BoxListResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';
import { Box } from '../../../domain/entities/box/Box';
import { OwnerNameResolver } from '../../../infra/services/OwnerNameResolver';
import { Variant } from '../../../domain/entities/Variant';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { computeBoxListMetrics } from '../../../infra/services/box/boxListMetrics';
import {
	TextileProductAttributes,
	TextileProductAttributesAssembler,
} from '../../../infra/services/textileProducts/TextileProductAttributesAssembler';

@Injectable()
export class GetAllBoxesUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
		private readonly ownerNameResolver: OwnerNameResolver,
		private readonly textileAttributesAssembler: TextileProductAttributesAssembler,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
	): Promise<BoxListPaginatedResponse> {
		const { items, total } =
			await this.boxRepository.getIdsPageWithPositiveFulfillableStock(
				page,
				perPage,
			);

		if (items.length === 0) {
			return {
				data: [],
				pagination: { total, page, per_page: perPage },
			};
		}

		const boxes = await this.boxRepository.getByIdsInOrder(
			items.map((i) => i.id),
		);

		const dependencies =
			await this.boxResolutionService.bulkFetchBoxDependenciesForList(boxes);

		const textileProducts = [...dependencies.textileMap.values()];
		const textileVariants = [...dependencies.variantMap.values()].filter(
			(v) => v.productType === ProductType.TEXTILE,
		);
		const textileAttrsByProductId =
			textileProducts.length > 0
				? await this.textileAttributesAssembler.buildForProducts(
						textileProducts,
						textileVariants,
					)
				: new Map<string, TextileProductAttributes>();

		const ownerNameCache = new Map<string, string>();
		const enrichedBoxes: BoxListItemResponse[] = await Promise.all(
			boxes.map(async (box) => {
				let discartedPrice = 0;

				const metrics = computeBoxListMetrics(box, dependencies.variantMap);
				const fulfillableQuantity = metrics.fulfillableQuantity;

				for (const product of box.products) {
					if (!product.variantId) continue;
					const variant = dependencies.variantMap.get(product.variantId);
					if (!variant) continue;
					const catalog = this.boxResolutionService.getVariantPrice(variant);
					discartedPrice += catalog;
				}
				discartedPrice = Math.round(discartedPrice);

				const products = await this.buildListProducts(
					box,
					dependencies.variantMap,
					dependencies.superfoodMap,
					dependencies.textileMap,
					dependencies.mediaMap,
					ownerNameCache,
					textileAttrsByProductId,
				);

				const boxThumb = this.boxResolutionService.resolveImage(
					box.thumbnailImageId,
					dependencies.mediaMap,
				);
				const porcentageDiscount = this.resolveDiscountPercentage(
					box,
					discartedPrice,
				);

				return {
					id: box.id,
					name: box.name,
					slogan: box.slogan,
					status: box.status,
					itemCount: {
						textiles: metrics.textileCount,
						superfoods: metrics.superfoodCount,
					},
					discartedPrice,
					price: box.price,
					porcentageDiscount,
					thumbnailImage: boxThumb,
					fulfillableQuantity,
					products,
				};
			}),
		);

		return {
			data: enrichedBoxes,
			pagination: { total, page, per_page: perPage },
		};
	}

	private resolveDiscountPercentage(box: Box, discartedPrice: number): number {
		if (
			box.discountPercentage != null &&
			!Number.isNaN(box.discountPercentage)
		) {
			return Math.round(box.discountPercentage);
		}
		return discartedPrice > 0
			? Math.round((1 - box.price / discartedPrice) * 100)
			: 0;
	}

	private async buildListProducts(
		box: Box,
		variantMap: Map<string, Variant>,
		superfoodMap: Map<string, SuperfoodProduct>,
		textileMap: Map<string, TextileProduct>,
		mediaMap: Map<string, MediaItem>,
		ownerNameCache: Map<string, string>,
		textileAttrsByProductId: Map<string, TextileProductAttributes>,
	): Promise<BoxListProductResponse[]> {
		const rows: BoxListProductResponse[] = [];

		for (const line of box.products) {
			if (!line.variantId) continue;
			const variant = variantMap.get(line.variantId);
			if (!variant) continue;

			if (variant.productType === ProductType.SUPERFOOD) {
				const superfood = superfoodMap.get(variant.productId);
				const ownerType = superfood?.baseInfo?.ownerType;
				const ownerId = superfood?.baseInfo?.ownerId ?? '';
				if (!superfood?.baseInfo?.title || !ownerType) continue;

				const information = superfood.baseInfo.shortDescription?.trim() ?? '';
				rows.push({
					name: superfood.baseInfo.title,
					ownerType,
					owner: await this.resolveOwnerName(
						ownerType,
						ownerId,
						ownerNameCache,
					),
					type: ProductType.SUPERFOOD,
					thumbnailImage:
						this.boxResolutionService.resolveListProductThumbnailUrl(
							variant,
							textileMap,
							superfoodMap,
							mediaMap,
						),
					...(information ? { information } : {}),
				});
				continue;
			}

			if (variant.productType === ProductType.TEXTILE) {
				const textile = textileMap.get(variant.productId);
				const ownerType = textile?.baseInfo?.ownerType;
				const ownerId = textile?.baseInfo?.ownerId ?? '';
				if (!textile?.baseInfo?.title || !ownerType) continue;

				const variantInfo = textileAttrsByProductId
					.get(variant.productId)
					?.variantInfo.find((v) => v.variantId === variant.id);
				const colorLabel = variantInfo?.color?.color?.trim() ?? '';
				const colorHex = variantInfo?.color?.hexCode?.trim() ?? '';
				const size = variantInfo?.size?.trim() ?? '';
				const information = textile.baseInfo.information?.trim() ?? '';

				rows.push({
					name: textile.baseInfo.title,
					ownerType,
					owner: await this.resolveOwnerName(
						ownerType,
						ownerId,
						ownerNameCache,
					),
					type: ProductType.TEXTILE,
					thumbnailImage:
						this.boxResolutionService.resolveListProductThumbnailUrl(
							variant,
							textileMap,
							superfoodMap,
							mediaMap,
						),
					...(information ? { information } : {}),
					...(colorLabel
						? {
								color: {
									label: colorLabel,
									hexCode: colorHex || '#000000',
								},
							}
						: {}),
					...(size ? { size } : {}),
				});
			}
		}

		return rows;
	}

	private async resolveOwnerName(
		ownerType: OwnerType,
		ownerId: string,
		cache: Map<string, string>,
	): Promise<string> {
		const cacheKey = `${ownerType}:${ownerId}`;
		const cached = cache.get(cacheKey);
		if (cached) return cached;

		const ownerName = await this.ownerNameResolver.resolve(ownerType, ownerId);
		cache.set(cacheKey, ownerName);
		return ownerName;
	}
}

import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import {
	BoxListPaginatedResponse,
	BoxListItemResponse,
	BoxProductResponse,
} from '../../models/box/BoxListResponse';
import { BoxImageResponse } from '../../models/box/BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';
import { Box } from '../../../domain/entities/box/Box';

@Injectable()
export class GetAllBoxesUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
	): Promise<BoxListPaginatedResponse> {
		const { data: boxes, total } = await this.boxRepository.getAll(
			page,
			perPage,
		);

		const dependencies =
			await this.boxResolutionService.bulkFetchBoxDependencies(boxes);

		const enrichedBoxes: BoxListItemResponse[] = boxes.map((box) => {
			let discartedPrice = 0;
			let superfoodCount = 0;
			let textileCount = 0;
			const products: BoxProductResponse[] = [];

			for (const product of box.products) {
				if (product.productId) {
					superfoodCount++;
					const superfood = dependencies.superfoodMap.get(product.productId);
					if (superfood) {
						const catalog = this.boxResolutionService.getSuperfoodPrice(
							superfood,
						);
						const price = this.boxResolutionService.resolveLinePrice(
							product,
							catalog,
						);
						discartedPrice += price;

						const communityName =
							this.boxResolutionService.resolveCommunityName(
								superfood.baseInfo?.ownerId,
								dependencies.communityMap,
							);

						const thumbnailImage = this.boxResolutionService.resolveImage(
							superfood.baseInfo?.productMedia?.mainImgId,
							dependencies.mediaMap,
						);

						const narrativeImage = product.narrativeImgId?.trim()
							? this.boxResolutionService.resolveImage(
									product.narrativeImgId,
									dependencies.mediaMap,
								)
							: undefined;

						const row: BoxProductResponse = {
							name: superfood.baseInfo?.title || '',
							community: communityName,
							type: ProductType.SUPERFOOD,
							thumbnailImage,
						};
						if (
							narrativeImage &&
							(narrativeImage.url || narrativeImage.name)
						) {
							row.narrativeImage = narrativeImage;
						}
						products.push(row);
					}
				} else if (product.variantId) {
					textileCount++;
					const variant = dependencies.variantMap.get(product.variantId);
					if (variant) {
						const catalog = this.boxResolutionService.getVariantPrice(variant);
						const price = this.boxResolutionService.resolveLinePrice(
							product,
							catalog,
						);
						discartedPrice += price;
						const textile = dependencies.textileMap.get(variant.productId);

						let communityName = '';
						let thumbnailImage: BoxImageResponse = { url: '', name: '' };

						if (textile) {
							communityName = this.boxResolutionService.resolveCommunityName(
								textile.baseInfo?.ownerId,
								dependencies.communityMap,
							);
							thumbnailImage = this.boxResolutionService.resolveImage(
								textile.baseInfo?.mediaIds?.[0],
								dependencies.mediaMap,
							);
						}

						const narrativeImage = product.narrativeImgId?.trim()
							? this.boxResolutionService.resolveImage(
									product.narrativeImgId,
									dependencies.mediaMap,
								)
							: undefined;

						const row: BoxProductResponse = {
							name: textile?.baseInfo?.title || '',
							community: communityName,
							type: ProductType.TEXTILE,
							thumbnailImage,
						};
						if (
							narrativeImage &&
							(narrativeImage.url || narrativeImage.name)
						) {
							row.narrativeImage = narrativeImage;
						}
						products.push(row);
					}
				}
			}

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
				itemCount: { textiles: textileCount, superfoods: superfoodCount },
				discartedPrice,
				price: box.price,
				porcentageDiscount,
				thumbnailImage: boxThumb,
				products,
			};
		});

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
}

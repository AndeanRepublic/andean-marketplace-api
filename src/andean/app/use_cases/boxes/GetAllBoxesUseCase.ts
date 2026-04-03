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

		// Bulk fetch all dependencies in optimized parallel queries
		const dependencies =
			await this.boxResolutionService.bulkFetchBoxDependencies(boxes);

		// Assemble response using maps (zero additional queries)
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
						const price =
							this.boxResolutionService.getSuperfoodPrice(superfood);
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

						products.push({
							name: superfood.baseInfo?.title || '',
							community: communityName,
							type: ProductType.SUPERFOOD,
							thumbnailImage,
						});
					}
				} else if (product.variantId) {
					textileCount++;
					const variant = dependencies.variantMap.get(product.variantId);
					if (variant) {
						const price = this.boxResolutionService.getVariantPrice(variant);
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

						products.push({
							name: textile?.baseInfo?.title || '',
							community: communityName,
							type: ProductType.TEXTILE,
							thumbnailImage,
						});
					}
				}
			}

			const boxThumb = this.boxResolutionService.resolveImage(
				box.thumbnailImageId,
				dependencies.mediaMap,
			);
			const porcentageDiscount =
				discartedPrice > 0
					? Math.round((1 - box.price / discartedPrice) * 100)
					: 0;

			return {
				id: box.id,
				title: box.title,
				subtitle: box.subtitle,
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
}

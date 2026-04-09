import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import {
	BoxListPaginatedResponse,
	BoxListItemResponse,
} from '../../models/box/BoxListResponse';
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
			await this.boxResolutionService.bulkFetchBoxDependenciesForList(boxes);

		const enrichedBoxes: BoxListItemResponse[] = boxes.map((box) => {
			let discartedPrice = 0;
			let superfoodCount = 0;
			let textileCount = 0;

			const stocks: number[] = [];
			for (const p of box.products) {
				if (!p.variantId) continue;
				const variant = dependencies.variantMap.get(p.variantId);
				const stock = variant
					? Math.max(0, Math.floor(Number(variant.stock ?? 0)))
					: 0;
				stocks.push(stock);
			}

			let fulfillableQuantity = 0;
			if (stocks.length === 3) {
				fulfillableQuantity = Math.min(stocks[0]!, stocks[1]!, stocks[2]!);
			}

			for (const product of box.products) {
				if (!product.variantId) continue;
				const variant = dependencies.variantMap.get(product.variantId);
				if (!variant) continue;
				const catalog = this.boxResolutionService.getVariantPrice(variant);
				const price = this.boxResolutionService.resolveLinePrice(
					product,
					catalog,
				);
				discartedPrice += price;
				if (variant.productType === ProductType.SUPERFOOD) superfoodCount++;
				else if (variant.productType === ProductType.TEXTILE) textileCount++;
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
				fulfillableQuantity,
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

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StockReducerStrategy } from './StockReducerStrategy';
import { ProductType } from '../../../domain/enums/ProductType';
import { StockReductionItem } from '../../../app/models/shop/StockReductionItem';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';

@Injectable()
export class SuperfoodStockReducer extends StockReducerStrategy {
	readonly productType = ProductType.SUPERFOOD;

	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {
		super();
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
		if (item.variantId) {
			const variant = await this.variantRepository.reduceStock(
				item.variantId,
				item.quantity,
			);
			if (!variant) {
				throw new BadRequestException(
					`Insufficient variant stock for variant ${item.variantId}`,
				);
			}
		}

		const product = await this.superfoodProductRepository.reduceStock(
			item.productId,
			item.quantity,
		);
		if (!product) {
			throw new BadRequestException(
				`Insufficient stock for superfood product ${item.productId}`,
			);
		}
	}
}

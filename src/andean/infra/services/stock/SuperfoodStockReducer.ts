import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StockReducerStrategy } from './StockReducerStrategy';
import { ProductType } from '../../../domain/enums/ProductType';
import { StockReductionItem } from '../../../domain/interfaces/StockReductionItem';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';

@Injectable()
export class SuperfoodStockReducer extends StockReducerStrategy {
	readonly productType = ProductType.SUPERFOOD;

	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {
		super();
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
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

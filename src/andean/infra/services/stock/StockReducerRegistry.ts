import {
	Injectable,
	NotFoundException,
	forwardRef,
	Inject,
} from '@nestjs/common';
import { StockReductionItem } from '../../../domain/interfaces/StockReductionItem';
import { StockReducerStrategy } from './StockReducerStrategy';
import { TextileStockReducer } from './TextileStockReducer';
import { SuperfoodStockReducer } from './SuperfoodStockReducer';
import { BoxStockReducer } from './BoxStockReducer';

@Injectable()
export class StockReducerRegistry {
	private readonly reducers: StockReducerStrategy[];

	constructor(
		private readonly textileReducer: TextileStockReducer,
		private readonly superfoodReducer: SuperfoodStockReducer,
		@Inject(forwardRef(() => BoxStockReducer))
		private readonly boxReducer: BoxStockReducer,
	) {
		this.reducers = [
			this.textileReducer,
			this.superfoodReducer,
			this.boxReducer,
		];
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
		const reducer = this.reducers.find(
			(r) => r.productType === item.productType,
		);
		if (!reducer) {
			throw new NotFoundException(
				`Stock reducer not found for product type '${item.productType}'`,
			);
		}
		await reducer.reduceStock(item);
	}

	async reduceStockForItems(items: StockReductionItem[]): Promise<void> {
		for (const item of items) {
			await this.reduceStock(item);
		}
	}
}

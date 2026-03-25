import { StockReductionItem } from '../../../app/models/shop/StockReductionItem';

export const IStockReducerRegistry = Symbol('IStockReducerRegistry');

export interface IStockReducerRegistry {
	reduceStock(item: StockReductionItem): Promise<void>;
	reduceStockForItems(items: StockReductionItem[]): Promise<void>;
}

import { ProductType } from '../../../domain/enums/ProductType';
import { StockReductionItem } from '../../../domain/interfaces/StockReductionItem';

export abstract class StockReducerStrategy {
	abstract readonly productType: ProductType;
	abstract reduceStock(item: StockReductionItem): Promise<void>;
}

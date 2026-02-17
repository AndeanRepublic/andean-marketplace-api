import { Injectable, BadRequestException } from '@nestjs/common';
import { StockReducerRegistry } from '../../../infra/services/stock/StockReducerRegistry';
import { StockReductionItem } from '../../../domain/interfaces/StockReductionItem';
import { CartItem } from '../../../domain/entities/CartItem';

@Injectable()
export class ReduceStockFromOrderUseCase {
	constructor(
		private readonly stockReducerRegistry: StockReducerRegistry,
	) { }

	async handle(cartItems: CartItem[]): Promise<void> {
		const stockItems: StockReductionItem[] = cartItems.map((item) => ({
			productType: item.productType,
			productId: item.productId,
			quantity: item.quantity,
			variantId: item.variantProductId,
		}));

		try {
			await this.stockReducerRegistry.reduceStockForItems(stockItems);
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(
				'Failed to reduce stock for order items',
			);
		}
	}
}

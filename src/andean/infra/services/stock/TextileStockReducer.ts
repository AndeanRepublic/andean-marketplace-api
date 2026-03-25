import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StockReducerStrategy } from './StockReducerStrategy';
import { ProductType } from '../../../domain/enums/ProductType';
import { StockReductionItem } from '../../../app/models/shop/StockReductionItem';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';

@Injectable()
export class TextileStockReducer extends StockReducerStrategy {
	readonly productType = ProductType.TEXTILE;

	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {
		super();
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
		// 1. Reducir stock de la variante si existe
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

		// 2. Reducir stock total del producto textil
		const product = await this.textileProductRepository.reduceStock(
			item.productId,
			item.quantity,
		);
		if (!product) {
			throw new BadRequestException(
				`Insufficient stock for textile product ${item.productId}`,
			);
		}
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';

/**
 * Mantiene priceInventary.totalStock alineado con la suma de stock de variantes.
 */
@Injectable()
export class TextileProductStockFromVariantsSync {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) {}

	async apply(productId: string): Promise<number> {
		const variants = await this.variantRepository.getByProductId(productId);
		const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
		await this.textileProductRepository.setTotalStock(productId, totalStock);
		return totalStock;
	}
}

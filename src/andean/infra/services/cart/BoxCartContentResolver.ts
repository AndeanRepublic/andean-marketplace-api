import { Inject, Injectable } from '@nestjs/common';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { BoxContentItemResponse } from '../../../app/models/cart/BoxContentItemResponse';
import { ProductType } from '../../../domain/enums/ProductType';

/**
 * Resuelve el contenido de una caja (Box) para el contexto del carrito.
 * Cada línea referencia una variante (superfood o textil).
 */
@Injectable()
export class BoxCartContentResolver {
	constructor(
		@Inject(BoxRepository)
		private readonly boxRepository: BoxRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {}

	async resolve(boxId: string): Promise<BoxContentItemResponse[]> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) return [];

		const items: BoxContentItemResponse[] = [];

		for (const boxProduct of box.products) {
			if (!boxProduct.variantId) continue;

			const variant = await this.variantRepository.getById(
				boxProduct.variantId,
			);
			if (!variant) continue;

			if (variant.productType === ProductType.SUPERFOOD) {
				const superfood =
					await this.superfoodProductRepository.getSuperfoodProductById(
						variant.productId,
					);
				if (superfood) {
					items.push({
						title: superfood.baseInfo?.title || '',
						productType: ProductType.SUPERFOOD,
					});
				}
			} else if (variant.productType === ProductType.TEXTILE) {
				const textile =
					await this.textileProductRepository.getTextileProductById(
						variant.productId,
					);
				if (textile) {
					items.push({
						title: textile.baseInfo?.title || '',
						productType: ProductType.TEXTILE,
					});
				}
			}
		}

		return items;
	}
}

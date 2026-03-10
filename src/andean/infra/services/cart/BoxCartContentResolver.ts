import { Inject, Injectable } from '@nestjs/common';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { BoxContentItemResponse } from '../../../app/modules/cart/BoxContentItemResponse';
import { ProductType } from '../../../domain/enums/ProductType';

/**
 * Resuelve el contenido de una caja (Box) para el contexto del carrito.
 * Retorna la lista de productos contenidos con su título y tipo,
 * para que el front pueda asignar el icono correspondiente (textile/superfood).
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

	/**
	 * Dado un boxId, resuelve los productos contenidos en la caja.
	 * - Si el BoxProduct tiene productId → es un Superfood.
	 * - Si el BoxProduct tiene variantId → es un Textile (se busca la variante y luego el producto).
	 */
	async resolve(boxId: string): Promise<BoxContentItemResponse[]> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) return [];

		const items: BoxContentItemResponse[] = [];

		for (const boxProduct of box.products) {
			if (boxProduct.productId) {
				const superfood =
					await this.superfoodProductRepository.getSuperfoodProductById(
						boxProduct.productId,
					);
				if (superfood) {
					items.push({
						title: superfood.baseInfo?.title || '',
						productType: ProductType.SUPERFOOD,
					});
				}
			} else if (boxProduct.variantId) {
				const variant = await this.variantRepository.getById(
					boxProduct.variantId,
				);
				if (variant) {
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
		}

		return items;
	}
}

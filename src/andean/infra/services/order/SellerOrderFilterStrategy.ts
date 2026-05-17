import { Injectable, Inject } from '@nestjs/common';
import { OrderFilterStrategy } from './OrderFilterStrategy';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';

/**
 * Estrategia de filtrado para usuarios SELLER.
 * Los vendedores solo ven órdenes que contienen productos de su propiedad.
 *
 * Proceso:
 * 1. Consulta TextileProductRepository y SuperfoodProductRepository filtrando por ownerId
 * 2. Recopila todos los productIds del seller
 * 3. Retorna filtro MongoDB: { 'items.productId': { $in: [sellerProductIds] } }
 *
 * NOTA: BOX products no tienen ownerId (son curados por admins), por lo que no se incluyen.
 */
@Injectable()
export class SellerOrderFilterStrategy implements OrderFilterStrategy {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {}

	async buildFilter(user: any): Promise<Record<string, any>> {
		const sellerId = user.userId || user.id;

		if (!sellerId) {
			// Si no hay sellerId válido, retornar filtro que no coincida con nada
			return { _id: null };
		}

		// Obtener IDs de productos del seller en paralelo
		const [textileProducts, superfoodProducts] = await Promise.all([
			this.textileProductRepository.getAllWithFilters({
				ownerId: sellerId,
				page: 1,
				perPage: 10000, // Sin límite realista para obtener todos los productos del seller
			}),
			this.superfoodProductRepository.getAllWithFilters({
				ownerId: sellerId,
				page: 1,
				perPage: 10000,
			}),
		]);

		// Recopilar todos los product IDs
		const sellerProductIds: string[] = [
			...textileProducts.products.map((p) => p.id),
			...superfoodProducts.products.map((p) => p.id),
		];

		if (sellerProductIds.length === 0) {
			// El seller no tiene productos, retornar filtro que no coincida con nada
			return { _id: null };
		}

		// Filtrar órdenes donde al menos un item.productId está en la lista del seller
		return {
			'items.productId': { $in: sellerProductIds },
		};
	}
}

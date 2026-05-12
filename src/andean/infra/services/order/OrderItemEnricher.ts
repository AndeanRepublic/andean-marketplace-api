import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { ProductType } from '../../../domain/enums/ProductType';
import { ProductInfoProviderRegistry } from '../products/ProductInfoProviderRegistry';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { OwnerNameResolver } from '../OwnerNameResolver';

/**
 * Servicio que enriquece los items de órdenes con información actual de los productos.
 * Utiliza batching para prevenir queries N+1 y soporta múltiples tipos de productos
 * (TEXTILE, SUPERFOOD, BOX) mediante ProductInfoProvider.
 *
 * Campos enriquecidos:
 * - imageUrl: URL de la imagen principal del producto
 * - ownerName: Nombre del vendedor o comunidad propietaria
 */
@Injectable()
export class OrderItemEnricher {
	constructor(
		private readonly productInfoRegistry: ProductInfoProviderRegistry,
		private readonly ownerNameResolver: OwnerNameResolver,
	) {}

	/**
	 * Enriquece una lista de órdenes con información actual de sus items.
	 * Agrupa los productIds por tipo, los busca en batch usando el registry,
	 * resuelve ownerNames en batch, y mapea la información resultante a cada item.
	 */
	async enrichOrders(orders: Order[]): Promise<Order[]> {
		if (!orders || orders.length === 0) {
			return orders;
		}

		// Agrupar productIds únicos por tipo
		const productsByType = this.groupProductIdsByType(orders);

		if (productsByType.size === 0) {
			return orders;
		}

		// Batch fetch de ProductInfo para todos los tipos en paralelo
		const productInfoMap =
			await this.productInfoRegistry.getProductInfoBatch(productsByType);

		// Batch resolver ownerNames (extraer únicos ownerType+ownerId)
		const ownerNameMap = await this.resolveOwnerNames(productInfoMap);

		// Mapear información a items
		return orders.map((order) => ({
			...order,
			items: order.items.map((item) =>
				this.enrichItem(item, productInfoMap, ownerNameMap),
			),
		}));
	}

	/**
	 * Agrupa productIds únicos de todas las órdenes por su ProductType.
	 */
	private groupProductIdsByType(orders: Order[]): Map<ProductType, string[]> {
		const productsByType = new Map<ProductType, Set<string>>();

		for (const order of orders) {
			for (const item of order.items) {
				if (!productsByType.has(item.productType)) {
					productsByType.set(item.productType, new Set());
				}
				productsByType.get(item.productType)!.add(item.productId);
			}
		}

		// Convertir Sets a Arrays
		const result = new Map<ProductType, string[]>();
		productsByType.forEach((ids, type) => {
			result.set(type, Array.from(ids));
		});

		return result;
	}

	/**
	 * Resuelve nombres de owners en batch.
	 * Extrae pares únicos (ownerType, ownerId) y los resuelve en paralelo.
	 */
	private async resolveOwnerNames(
		productInfoMap: Map<string, ProductInfo>,
	): Promise<Map<string, string>> {
		const ownerNameMap = new Map<string, string>();

		// Extraer pares únicos (ownerType, ownerId)
		const uniqueOwners = new Map<string, { type: string; id: string }>();

		for (const productInfo of productInfoMap.values()) {
			if (productInfo.ownerType && productInfo.ownerId) {
				const key = `${productInfo.ownerType}:${productInfo.ownerId}`;
				uniqueOwners.set(key, {
					type: productInfo.ownerType,
					id: productInfo.ownerId,
				});
			}
		}

		// Resolver en paralelo
		const promises = Array.from(uniqueOwners.entries()).map(
			async ([key, owner]) => {
				const name = await this.ownerNameResolver.resolve(owner.type, owner.id);
				ownerNameMap.set(key, name);
			},
		);

		await Promise.all(promises);

		return ownerNameMap;
	}

	/**
	 * Enriquece un item individual con imageUrl y ownerName.
	 */
	private enrichItem(
		item: OrderItem,
		productInfoMap: Map<string, ProductInfo>,
		ownerNameMap: Map<string, string>,
	): OrderItem {
		const productInfo = productInfoMap.get(item.productId);

		if (!productInfo) {
			return item; // Producto eliminado, no enriquecer
		}

		const ownerKey = `${productInfo.ownerType}:${productInfo.ownerId}`;
		const ownerName = productInfo.ownerType
			? ownerNameMap.get(ownerKey)
			: undefined;

		return {
			...item,
			imageUrl: productInfo.thumbnailImgUrl || undefined,
			ownerName,
		};
	}
}

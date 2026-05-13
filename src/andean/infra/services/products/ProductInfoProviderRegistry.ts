import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductInfoProvider } from './TextileProductInfoProvider';
import { SuperfoodProductInfoProvider } from './SuperfoodProductInfoProvider';
import { BoxProductInfoProvider } from './BoxProductInfoProvider';

/**
 * Registry que agrupa todos los ProductInfoProviders.
 * Permite obtener información de cualquier tipo de producto de forma unificada.
 *
 * Para agregar un nuevo tipo de producto:
 * 1. Crear el provider (ej: ExperienceProductInfoProvider)
 * 2. Inyectarlo en el constructor
 * 3. Agregarlo al array de providers
 */
@Injectable()
export class ProductInfoProviderRegistry {
	private readonly providers: ProductInfoProvider[];

	constructor(
		private readonly textileProvider: TextileProductInfoProvider,
		private readonly superfoodProvider: SuperfoodProductInfoProvider,
		private readonly boxProvider: BoxProductInfoProvider,
	) {
		this.providers = [
			this.textileProvider,
			this.superfoodProvider,
			this.boxProvider,
		];
	}

	/**
	 * Obtiene la información del producto según su tipo.
	 * @throws NotFoundException si el tipo no está soportado o el producto no existe.
	 */
	async getProductInfo(
		productType: ProductType,
		productId: string,
	): Promise<ProductInfo> {
		const provider = this.providers.find((p) => p.supports(productType));

		if (!provider) {
			throw new NotFoundException(
				`Product type '${productType}' is not yet supported`,
			);
		}

		const productInfo = await provider.getProductInfo(productId);

		if (!productInfo) {
			throw new NotFoundException(`Product with id '${productId}' not found`);
		}

		return productInfo;
	}

	/**
	 * Obtiene información de múltiples productos agrupados por tipo en batch.
	 * Procesa cada tipo en paralelo para máxima performance.
	 * @param productsByType - Map de ProductType -> array de productIds
	 * @returns Map de productId -> ProductInfo (excluye productos no encontrados)
	 */
	async getProductInfoBatch(
		productsByType: Map<ProductType, string[]>,
	): Promise<Map<string, ProductInfo>> {
		const allResults = new Map<string, ProductInfo>();

		// Procesar cada tipo de producto en paralelo
		const promises = Array.from(productsByType.entries()).map(
			async ([productType, productIds]) => {
				const provider = this.providers.find((p) => p.supports(productType));

				if (!provider) {
					// Tipo no soportado, productos no se enriquecen (quedan sin ProductInfo)
					return;
				}

				const results = await provider.getProductInfoByIds(productIds);
				results.forEach((productInfo, productId) => {
					allResults.set(productId, productInfo);
				});
			},
		);

		await Promise.all(promises);

		return allResults;
	}
}

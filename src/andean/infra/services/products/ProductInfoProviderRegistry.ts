import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../domain/interfaces/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductInfoProvider } from './TextileProductInfoProvider';
import { SuperfoodProductInfoProvider } from './SuperfoodProductInfoProvider';

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
		// Agregar nuevos providers aquí cuando se implementen
		// private readonly experienceProvider: ExperienceProductInfoProvider,
	) {
		this.providers = [
			this.textileProvider,
			this.superfoodProvider,
			// this.experienceProvider,
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
}

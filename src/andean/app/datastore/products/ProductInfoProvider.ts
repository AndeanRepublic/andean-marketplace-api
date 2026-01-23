import { ProductType } from '../../../domain/enums/ProductType';
import { ProductInfo } from '../../../domain/interfaces/ProductInfo';

/**
 * Clase abstracta que define el contrato para obtener información de productos.
 * Cada tipo de producto (Textile, Superfood, Experience) debe implementar su propio provider.
 *
 * Sigue el patrón Strategy para permitir agregar nuevos tipos de productos
 * sin modificar el código existente (Open/Closed Principle).
 */
export abstract class ProductInfoProvider {
	/**
	 * Indica si este provider puede manejar el tipo de producto dado.
	 */
	abstract supports(productType: ProductType): boolean;

	/**
	 * Obtiene la información del producto por su ID.
	 * @returns ProductInfo si el producto existe, null si no existe.
	 */
	abstract getProductInfo(productId: string): Promise<ProductInfo | null>;
}

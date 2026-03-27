import { ShoppingCartItemResponse } from '../../../app/models/cart/ShoppingCartItemResponse';
import { BoxContentItemResponse } from '../../../app/models/cart/BoxContentItemResponse';
import { CartItem } from '../../../domain/entities/CartItem';
import { Variant } from '../../../domain/entities/Variant';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';

/**
 * Mapper para transformar datos de CartItem a ShoppingCartItemResponse.
 * Enriquece el item del carrito con información del producto y variante.
 */
export class ShoppingCartItemMapper {
	/**
	 * Transforma un CartItem en ShoppingCartItemResponse con datos enriquecidos.
	 *
	 * @param item - Item del carrito
	 * @param variant - Variante del producto (puede ser null)
	 * @param productInfo - Información del producto
	 * @param ownerName - Nombre del vendedor o comunidad
	 */
	static toResponse(
		item: CartItem,
		variant: Variant | null,
		productInfo: ProductInfo,
		ownerName: string,
	): ShoppingCartItemResponse {
		return {
			productId: item.productId,
			variantId: item.variantProductId ?? null,
			ownerName,
			title: productInfo.title,
			combinationVariant: variant?.combination || {},
			thumbnailImgUrl: productInfo.thumbnailImgUrl,
			unitPrice: item.unitPrice,
			quantity: item.quantity,
			idShoppingCartItem: item.id,
			maxStock: variant?.stock || 0,
			isDiscountActive: productInfo.isDiscountActive,
			productType: item.productType,
		};
	}

	/**
	 * Transforma un CartItem de tipo BOX en ShoppingCartItemResponse.
	 * Las cajas tienen quantity=1, maxStock=1, ownerName vacío y sin variante.
	 * Incluye el contenido de la caja (boxContent) para mostrar productos internos.
	 */
	static toBoxResponse(
		item: CartItem,
		productInfo: ProductInfo,
		boxContent: BoxContentItemResponse[],
	): ShoppingCartItemResponse {
		return {
			productId: item.productId,
			variantId: item.variantProductId ?? null,
			ownerName: '',
			title: productInfo.title,
			combinationVariant: {},
			thumbnailImgUrl: productInfo.thumbnailImgUrl,
			unitPrice: item.unitPrice,
			quantity: 1,
			idShoppingCartItem: item.id,
			maxStock: 1,
			isDiscountActive: false,
			productType: ProductType.BOX,
			boxContent,
		};
	}

	/**
	 * Construye un ShoppingCartItemResponse a partir de datos individuales.
	 * Útil cuando no se tiene un CartItem pero sí los datos sueltos.
	 *
	 * @param params - Parámetros para construir la respuesta
	 */
	static fromParams(params: {
		cartItemId: string;
		variant: Variant;
		productInfo: ProductInfo;
		ownerName: string;
		quantity: number;
	}): ShoppingCartItemResponse {
		return {
			productId: params.variant.productId,
			variantId: params.variant.id,
			ownerName: params.ownerName,
			title: params.productInfo.title,
			combinationVariant: params.variant.combination,
			thumbnailImgUrl: params.productInfo.thumbnailImgUrl,
			unitPrice: params.variant.price,
			quantity: params.quantity,
			idShoppingCartItem: params.cartItemId,
			maxStock: params.variant.stock,
			isDiscountActive: params.productInfo.isDiscountActive,
			productType: params.variant.productType,
		};
	}
}

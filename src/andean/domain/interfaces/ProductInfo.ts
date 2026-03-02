/**
 * Información básica de un producto para uso en carrito y otras operaciones.
 * Esta interfaz es agnóstica al tipo de producto.
 */
export interface ProductInfo {
	title: string;
	thumbnailImgUrl: string;
	ownerType: string;
	ownerId: string;
	isDiscountActive: boolean;
}

import { ApiProperty } from '@nestjs/swagger';

/**
 * Respuesta al agregar un item al carrito de compras.
 * Contiene información resumida del producto agregado.
 */
export class AddCartItemResponse {
	@ApiProperty({
		description: 'Nombre comercial del vendedor o comunidad',
		example: 'Artesanías Cusco',
	})
	ownerName: string;

	@ApiProperty({
		description: 'Título del producto',
		example: 'Poncho Tradicional Andino',
	})
	titulo: string;

	@ApiProperty({
		description: 'Combinación de opciones de la variante seleccionada',
		example: { color: 'brown', size: 'xl', material: 'seda' },
	})
	combinationVariant: Record<string, string>;

	@ApiProperty({
		description: 'URL de la imagen principal del producto',
		example: 'https://storage.example.com/products/poncho-001.jpg',
	})
	thumbnailImgUrl: string;

	@ApiProperty({
		description: 'Precio unitario de la variante',
		example: 165.0,
	})
	unitPrice: number;

	@ApiProperty({
		description: 'Cantidad agregada al carrito',
		example: 2,
	})
	quantity: number;

	@ApiProperty({
		description: 'ID del item del carrito creado',
		example: 'cart-item-uuid-1234',
	})
	idShoppingCartItem: string;

	@ApiProperty({
		description: 'Stock máximo disponible de esta variante',
		example: 10,
	})
	maxStock: number;

	@ApiProperty({
		description: 'Indica si el producto tiene descuento activo',
		example: false,
	})
	isDiscountActive: boolean;
}

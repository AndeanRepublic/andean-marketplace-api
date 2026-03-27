import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoxContentItemResponse } from './BoxContentItemResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { CartColorOptionResponse } from './CartColorOptionResponse';

/**
 * Información de un item del carrito de compras.
 * Contiene datos enriquecidos del producto y variante.
 */
export class ShoppingCartItemResponse {
	@ApiProperty({
		description: 'ID del producto asociado al item del carrito',
		example: 'product-uuid-1234',
	})
	productId!: string;

	@ApiPropertyOptional({
		description:
			'ID de la variante asociada al item del carrito (null para items sin variante)',
		example: 'variant-uuid-1234',
	})
	variantId?: string | null;

	@ApiProperty({
		description: 'Nombre comercial del vendedor o comunidad',
		example: 'Artesanías Cusco',
	})
	ownerName!: string;

	@ApiProperty({
		description: 'Título del producto',
		example: 'Poncho Tradicional Andino',
	})
	title!: string;

	@ApiProperty({
		description: 'Combinación de opciones de la variante seleccionada',
		example: { color: 'brown', size: 'xl', material: 'seda' },
	})
	combinationVariant!: Record<string, string>;

	@ApiPropertyOptional({
		description:
			'Color resuelto para textiles (etiqueta + hex del catálogo); opcional si no aplica o no se pudo resolver',
		type: () => CartColorOptionResponse,
	})
	colorOption?: CartColorOptionResponse;

	@ApiProperty({
		description: 'URL de la imagen principal del producto',
		example: 'https://storage.example.com/products/poncho-001.jpg',
	})
	thumbnailImgUrl!: string;

	@ApiProperty({
		description: 'Precio unitario de la variante',
		example: 165.0,
	})
	unitPrice!: number;

	@ApiProperty({
		description: 'Cantidad en el carrito',
		example: 2,
	})
	quantity!: number;

	@ApiProperty({
		description: 'ID del item del carrito',
		example: 'cart-item-uuid-1234',
	})
	idShoppingCartItem!: string;

	@ApiProperty({
		description: 'Stock máximo disponible de esta variante',
		example: 10,
	})
	maxStock!: number;

	@ApiProperty({
		description: 'Indica si el producto tiene descuento activo',
		example: false,
	})
	isDiscountActive!: boolean;

	@ApiProperty({
		description: 'Tipo de producto (TEXTILE, SUPERFOOD, BOX, etc.)',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	productType!: ProductType;

	@ApiPropertyOptional({
		description:
			'Contenido de la caja (solo presente cuando el item es de tipo BOX)',
		type: [BoxContentItemResponse],
	})
	boxContent?: BoxContentItemResponse[];
}

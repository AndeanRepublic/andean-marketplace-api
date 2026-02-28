import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../../domain/enums/ProductType';

/**
 * Representa un producto contenido dentro de una caja (Box).
 * Se usa en el carrito para mostrar el resumen de productos con su icono correspondiente.
 */
export class BoxContentItemResponse {
	@ApiProperty({
		description: 'Título del producto contenido en la caja',
		example: 'Pink Salt from Maras',
	})
	title!: string;

	@ApiProperty({
		description: 'Tipo de producto (para asignar icono en front)',
		enum: ProductType,
		example: ProductType.SUPERFOOD,
	})
	productType!: ProductType;
}

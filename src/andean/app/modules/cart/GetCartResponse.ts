import { ApiProperty } from '@nestjs/swagger';
import { ShoppingCartItemResponse } from './ShoppingCartItemResponse';

/**
 * Respuesta al obtener el carrito de compras de un cliente.
 * Incluye los items enriquecidos y los totales del carrito.
 */
export class GetCartResponse {
	@ApiProperty({
		description: 'Lista de items en el carrito con información enriquecida',
		type: [ShoppingCartItemResponse],
	})
	items: ShoppingCartItemResponse[];

	@ApiProperty({
		description: 'Costo de envío/delivery',
		example: 15.0,
	})
	delivery: number;

	@ApiProperty({
		description: 'Descuento aplicado al carrito',
		example: 10.0,
	})
	discount: number;

	@ApiProperty({
		description: 'Impuestos o comisiones aplicadas',
		example: 5.0,
	})
	taxOrFee: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CartItemQuantityResponse {
	@ApiProperty({
		description: 'Cantidad actual del item después de aplicar el cambio',
		example: 3,
	})
	quantity: number;

	@ApiProperty({
		description: 'ID del item del carrito de compras',
		example: '507f1f77bcf86cd799439011',
	})
	idShoppingCartItem: string;

	@ApiProperty({
		description: 'Stock máximo disponible (de la variante si existe, o del producto si no hay variante)',
		example: 50,
	})
	maxStock: number;
}

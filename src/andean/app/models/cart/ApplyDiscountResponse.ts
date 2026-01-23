import { ApiProperty } from '@nestjs/swagger';

export class ApplyDiscountResponse {
	@ApiProperty({
		description: 'Porcentaje de descuento aplicado (3, 7, o 11)',
		example: 7,
	})
	percentage: number;

	@ApiProperty({
		description: 'Monto del descuento calculado y aplicado',
		example: 10.5,
	})
	discount: number;

	@ApiProperty({
		description: 'ID del item del carrito al que se aplicó el descuento',
		example: '507f1f77bcf86cd799439011',
	})
	cartItemId: string;
}

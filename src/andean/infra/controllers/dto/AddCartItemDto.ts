import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
	@ApiProperty({
		description: 'ID de la variante del producto a agregar',
		example: 'variant-uuid-1234',
	})
	@IsString()
	@IsNotEmpty()
	variantId: string;

	@ApiProperty({
		description: 'Cantidad a agregar al carrito',
		example: 2,
		minimum: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	quantity: number;
}

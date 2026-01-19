import { IsNotEmpty, IsNumber, IsObject, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodVariantDto {
	@ApiProperty({
		description: 'Combinación de opciones',
		example: { "opt_color": "rojo", "opt_size": "grande" }
	})
	@IsObject()
	@IsNotEmpty()
	combination: Record<string, string>;

	@ApiProperty({ description: 'Precio de la variante', example: 30.00, minimum: 0 })
	@IsNumber()
	@IsNotEmpty()
	@Min(0, { message: 'Variant price must be greater than or equal to 0' })
	price: number;

	@ApiProperty({ description: 'Stock de la variante', example: 50, minimum: 0 })
	@IsNumber()
	@IsNotEmpty()
	@Min(0, { message: 'Variant stock must be greater than or equal to 0' })
	stock: number;
}

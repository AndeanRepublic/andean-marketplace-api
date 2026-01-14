import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodVariantDto {
	@ApiProperty({
		description: 'Combinación de opciones',
		example: { "opt_color": "rojo", "opt_size": "grande" }
	})
	@IsObject()
	@IsNotEmpty()
	combination: Record<string, string>;

	@ApiProperty({ description: 'Precio de la variante' })
	@IsNumber()
	@IsNotEmpty()
	price: number;

	@ApiProperty({ description: 'Stock de la variante' })
	@IsNumber()
	@IsNotEmpty()
	stock: number;
}

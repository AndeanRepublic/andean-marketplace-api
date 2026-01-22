import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsInt,
	Min,
	IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
	@ApiProperty({
		description: 'ID del producto al que pertenece esta variante',
		example: 'product-uuid-1234',
	})
	@IsString()
	@IsNotEmpty()
	productId: string;

	@ApiProperty({
		description: 'Combinación de opciones que define esta variante',
		example: { color: 'rojo', size: 'M' },
	})
	@IsObject()
	@IsNotEmpty()
	combination: Record<string, string>;

	@ApiProperty({
		description: 'Precio específico de esta variante',
		example: 165.00,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	price: number;

	@ApiProperty({
		description: 'Stock disponible de esta variante',
		example: 10,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsNotEmpty()
	stock: number;
}

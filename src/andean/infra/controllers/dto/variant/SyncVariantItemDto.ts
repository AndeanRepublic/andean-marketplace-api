import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsInt,
	Min,
	IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para cada variante en la sincronización.
 * combination es requerido ya que es la clave de comparación.
 */
export class SyncVariantItemDto {
	@ApiProperty({
		description:
			'Combinación de opciones que define esta variante (clave de comparación)',
		example: { color: 'rojo', size: 'M' },
	})
	@IsObject()
	@IsNotEmpty()
	combination: Record<string, string>;

	@ApiProperty({
		description: 'Precio específico de esta variante',
		example: 165.0,
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

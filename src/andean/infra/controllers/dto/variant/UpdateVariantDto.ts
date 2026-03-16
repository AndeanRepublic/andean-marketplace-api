import {
	IsString,
	IsNumber,
	IsInt,
	Min,
	IsObject,
	IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
	@ApiPropertyOptional({
		description: 'Combinación de opciones que define esta variante',
		example: { color: 'rojo', size: 'M' },
	})
	@IsObject()
	@IsOptional()
	combination?: Record<string, string>;

	@ApiPropertyOptional({
		description: 'Precio específico de esta variante',
		example: 165.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	@IsOptional()
	price?: number;

	@ApiPropertyOptional({
		description: 'Stock disponible de esta variante',
		example: 10,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsOptional()
	stock?: number;

	@ApiPropertyOptional({
		description: 'Código SKU único de esta variante',
		example: 'PONCHO-AND-001-RED-M',
	})
	@IsString()
	@IsOptional()
	sku?: string;
}

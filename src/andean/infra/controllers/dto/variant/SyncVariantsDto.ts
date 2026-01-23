import {
	ValidateNested,
	IsArray,
	IsString,
	IsNotEmpty,
	IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SyncVariantItemDto } from './SyncVariantItemDto';
import { ProductType } from 'src/andean/domain/enums/ProductType';

/**
 * DTO para sincronizar las variantes de un producto.
 * Compara por combination:
 * - Si coincide: actualiza los valores
 * - Si no existe en BD: crea nueva variante
 * - Si existe en BD pero no en la lista: elimina la variante
 */
export class SyncVariantsDto {
	@ApiProperty({
		description: 'ID del producto al que pertenecen las variantes',
		example: 'product-uuid-1234',
	})
	@IsString()
	@IsNotEmpty()
	productId: string;

	@ApiProperty({
		description: 'Tipo de producto al que pertenecen las variantes',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	@IsEnum(ProductType)
	@IsNotEmpty()
	productType: ProductType;

	@ApiProperty({
		description: 'Lista de variantes a sincronizar',
		type: [SyncVariantItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SyncVariantItemDto)
	variants: SyncVariantItemDto[];
}

import {
	IsArray,
	IsIn,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodOptionName } from '../../../../domain/enums/SuperfoodOptionName';

export class CreateSuperfoodOptionsItemDto {
	@ApiProperty({ description: 'Etiqueta del item de opción', example: 'Rojo' })
	@IsString()
	@IsNotEmpty()
	label!: string;

	@ApiProperty({
		description: 'IDs de MediaItems',
		type: [String],
		required: false,
	})
	@IsArray()
	@IsOptional()
	mediaIds?: string[];

	@ApiProperty({
		description: 'ID de alternativa de talla para esta opción',
		required: false,
	})
	@IsString()
	@IsOptional()
	idOptionAlternative?: string;

	@ApiProperty({
		description: 'Valor numérico del tamaño de empaque',
		example: 1,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	sizeNumber?: number;

	@ApiProperty({
		description: 'Unidad del tamaño de empaque',
		enum: ['g', 'mg', 'kg'],
		example: 'kg',
		required: false,
	})
	@IsIn(['g', 'mg', 'kg'])
	@IsOptional()
	sizeUnit?: 'g' | 'mg' | 'kg';

	@ApiProperty({
		description: 'Cantidad de porciones por empaque',
		example: 30,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	servingsPerContainer?: number;

	@ApiProperty({
		description: 'Precio de la variante',
		example: 39.9,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	price?: number;

	@ApiProperty({
		description: 'Stock de la variante',
		example: 100,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	stock?: number;

	@ApiProperty({
		description: 'SKU de la variante',
		example: 'SF-1KG-001',
		required: false,
	})
	@IsString()
	@IsOptional()
	sku?: string;
}

export class CreateSuperfoodOptionsDto {
	@ApiProperty({
		description: 'Nombre de la opción',
		enum: SuperfoodOptionName,
		example: SuperfoodOptionName.SIZE,
	})
	@IsEnum(SuperfoodOptionName)
	@IsNotEmpty()
	name!: SuperfoodOptionName;

	@ApiProperty({
		description: 'Valores de la opción',
		type: [CreateSuperfoodOptionsItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodOptionsItemDto)
	values!: CreateSuperfoodOptionsItemDto[];
}

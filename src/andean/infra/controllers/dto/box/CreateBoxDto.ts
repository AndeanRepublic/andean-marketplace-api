import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsArray,
	ArrayNotEmpty,
	ValidateNested,
	IsOptional,
	IsEnum,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoxProductType } from '../../../../domain/enums/BoxProductType';

export class BoxProductDto {
	@ApiProperty({
		description: 'Tipo de producto (TEXTILE o SUPERFOOD)',
		example: 'TEXTILE',
		enum: BoxProductType,
	})
	@IsEnum(BoxProductType)
	@IsNotEmpty()
	productType!: BoxProductType;

	@ApiPropertyOptional({
		description: 'ID del producto a incluir en el box',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	@IsString()
	@IsOptional()
	productId?: string;

	@ApiPropertyOptional({
		description: 'ID de la variante a incluir en el box',
		example: '6973d8ffddef7b59c2d4dcfc',
	})
	@IsString()
	@IsOptional()
	variantId?: string;
}

export class CreateBoxDto {
	@ApiProperty({
		description: 'Título del box',
		example: 'Box Andino Premium',
	})
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty({
		description: 'Subtítulo del box',
		example: 'Lo mejor de los Andes en una caja',
	})
	@IsString()
	@IsNotEmpty()
	subtitle!: string;

	@ApiProperty({
		description: 'Descripción detallada del box',
		example:
			'Una selección curada de productos andinos tradicionales que incluye superfoods y textiles artesanales.',
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'ID de la imagen de miniatura del box',
		example: '6973d8ffddef7b59c2d4dcfd',
	})
	@IsString()
	@IsNotEmpty()
	thumbnailImageId!: string;

	@ApiProperty({
		description: 'ID de la imagen principal del box',
		example: '6973d8ffddef7b59c2d4dcfe',
	})
	@IsString()
	@IsNotEmpty()
	mainImageId!: string;

	@ApiProperty({
		description:
			'Lista de productos incluidos en el box. Cada producto debe tener productId (superfood) o variantId (textil)',
		type: [BoxProductDto],
	})
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => BoxProductDto)
	products!: BoxProductDto[];

	@ApiProperty({
		description: 'Precio del box',
		example: 149.99,
		minimum: 0.01,
	})
	@IsNumber()
	@Min(0.01)
	price!: number;

	@ApiPropertyOptional({
		description: 'Lista de IDs de sellos asociados al box',
		example: ['6973d8ffddef7b59c2d4dcff'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	sealIds?: string[];
}

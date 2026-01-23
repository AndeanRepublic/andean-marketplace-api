import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSuperfoodOptionsItemDto {
	@ApiProperty({ description: 'Etiqueta del item de opción', example: 'Rojo' })
	@IsString()
	@IsNotEmpty()
	label: string;

	@ApiProperty({
		description: 'IDs de MediaItems',
		type: [String],
		required: false,
	})
	@IsArray()
	@IsOptional()
	mediaIds?: string[];
}

export class CreateSuperfoodOptionsDto {
	@ApiProperty({ description: 'Nombre de la opción', example: 'Color' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Valores de la opción',
		type: [CreateSuperfoodOptionsItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodOptionsItemDto)
	values: CreateSuperfoodOptionsItemDto[];
}

import {
	IsArray,
	IsEnum,
	IsNotEmpty,
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

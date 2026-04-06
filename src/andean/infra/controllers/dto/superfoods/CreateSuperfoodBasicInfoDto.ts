import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OwnerType } from '../../../../domain/enums/OwnerType';
import { CreateSuperfoodProductMediaDto } from './CreateSuperfoodProductMediaDto';

export class CreateSuperfoodBasicInfoDto {
	@ApiProperty({
		description: 'Título del superfood',
		example: 'Quinua Orgánica Premium',
	})
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty({ type: CreateSuperfoodProductMediaDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodProductMediaDto)
	@IsNotEmpty()
	productMedia!: CreateSuperfoodProductMediaDto;

	@ApiProperty({
		description: 'Frase con beneficio principal o gancho',
		example: 'Quinua orgánica en grano, alto valor proteico.',
	})
	@IsString()
	@IsNotEmpty()
	shortDescription!: string;

	@ApiProperty({
		description:
			'Historia del producto, uso tradicional, beneficios, comunidad',
		example: 'Cultivada sobre 3800 m.s.n.m. en Puno, sin pesticidas...',
	})
	@IsString()
	@IsNotEmpty()
	detailedDescription!: string;

	@ApiProperty({
		description: 'Características generales (mín. 1, máx. 3)',
		type: [String],
		minItems: 1,
		maxItems: 3,
	})
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(3)
	@IsString({ each: true })
	@MinLength(1, { each: true })
	general_features!: string[];

	@ApiProperty({
		description: 'IDs de características nutricionales (máx. 4)',
		type: [String],
	})
	@IsArray()
	@ArrayMaxSize(4)
	@IsOptional()
	nutritional_features?: string[];

	@ApiProperty({
		description: 'IDs de beneficios del catálogo (mín. 1)',
		type: [String],
		minItems: 1,
	})
	@IsArray()
	@ArrayMinSize(1)
	@IsMongoId({ each: true })
	benefits!: string[];

	@ApiProperty({ enum: OwnerType })
	@IsEnum(OwnerType)
	@IsNotEmpty()
	ownerType!: OwnerType;

	@ApiProperty({ description: 'ID del dueño (Shop o Community)' })
	@IsString()
	@IsNotEmpty()
	ownerId!: string;
}

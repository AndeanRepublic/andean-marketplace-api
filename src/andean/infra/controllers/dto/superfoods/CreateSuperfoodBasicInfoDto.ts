import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SuperfoodOwnerType } from '../../../../domain/enums/SuperfoodOwnerType';

export class CreateSuperfoodBasicInfoDto {
	@ApiProperty({
		description: 'Título del superfood',
		example: 'Quinua Orgánica Premium',
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ description: 'IDs de MediaItems', type: [String] })
	@IsArray()
	@IsOptional()
	mediaIds?: string[];

	@ApiProperty({
		description: 'Frase con beneficio principal o gancho',
		example: 'Quinua orgánica en grano, alto valor proteico.',
	})
	@IsString()
	@IsNotEmpty()
	shortDescription: string;

	@ApiProperty({
		description:
			'Historia del producto, uso tradicional, beneficios, comunidad',
		example: 'Cultivada sobre 3800 m.s.n.m. en Puno, sin pesticidas...',
	})
	@IsString()
	@IsNotEmpty()
	detailedDescription: string;

	@ApiProperty({ description: 'Características generales', type: [String] })
	@IsArray()
	@IsOptional()
	general_features?: string[];

	@ApiProperty({
		description: 'IDs de características nutricionales',
		type: [String],
	})
	@IsArray()
	@IsOptional()
	nutritional_features?: string[];

	@ApiProperty({ description: 'IDs de beneficios', type: [String] })
	@IsArray()
	@IsOptional()
	benefits?: string[];

	@ApiProperty({ enum: SuperfoodOwnerType })
	@IsEnum(SuperfoodOwnerType)
	@IsNotEmpty()
	ownerType: SuperfoodOwnerType;

	@ApiProperty({ description: 'ID del dueño (Shop o Community)' })
	@IsString()
	@IsNotEmpty()
	ownerId: string;
}

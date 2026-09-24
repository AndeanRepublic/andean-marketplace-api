import {
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsArray,
	IsOptional,
	IsMongoId,
	IsBoolean,
	ArrayMinSize,
	ArrayMaxSize,
	ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateProviderInfoDto } from '../providerInfo/CreateProviderInfoDto';
import { CreateCommunityPageInfoDto } from './CreateCommunityPageInfoDto';

export class CreateCommunityDto {
	@ApiProperty({
		description: 'Nombre de la comunidad',
		example: 'Comunidad Artesanal de Cusco',
		minLength: 3,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	name!: string;

	@ApiProperty({
		description: 'ID del MediaItem para la imagen banner de la comunidad',
		example: '67890abcdef1234567890123',
	})
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	bannerImageId!: string;

	@ApiProperty({
		description: 'Array de exactamente 4 IDs de seals asociados a la comunidad',
		example: [
			'67890abcdef1234567890123',
			'67890abcdef1234567890124',
			'67890abcdef1234567890125',
			'67890abcdef1234567890126',
		],
		type: [String],
		minItems: 4,
		maxItems: 4,
	})
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(4)
	@ArrayMaxSize(4)
	seals!: string[];

	@ApiPropertyOptional({
		description: 'Datos de ProviderInfo para crear y asociar a la comunidad',
		type: CreateProviderInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProviderInfoDto)
	providerInfo?: CreateProviderInfoDto;

	@ApiPropertyOptional({ description: 'Indica si la página pública está activa' })
	@IsOptional()
	@IsBoolean()
	activePage?: boolean;

	@ApiPropertyOptional({
		description: 'Datos de la página pública de la comunidad',
		type: CreateCommunityPageInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateCommunityPageInfoDto)
	pageInfo?: CreateCommunityPageInfoDto;
}

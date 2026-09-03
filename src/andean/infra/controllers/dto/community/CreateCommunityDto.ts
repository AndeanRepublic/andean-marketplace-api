import {
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsArray,
	IsOptional,
	IsMongoId,
	IsBoolean,
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

	@ApiPropertyOptional({
		description: 'Array de IDs de seals asociados a la comunidad',
		example: ['67890abcdef1234567890123', '67890abcdef1234567890124'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	seals?: string[];

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

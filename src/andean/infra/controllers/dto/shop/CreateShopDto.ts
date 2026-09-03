import { ShopCategory } from '../../../../domain/enums/ShopCategory';
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayNotEmpty,
	IsEnum,
	IsOptional,
	IsMongoId,
	IsBoolean,
	ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateProviderInfoDto } from '../providerInfo/CreateProviderInfoDto';
import { CreateShopPageInfoDto } from './CreateShopPageInfoDto';
import { CreateFounderInfoDto } from './CreateFounderInfoDto';

export class CreateShopDto {
	@ApiPropertyOptional({
		description:
			'ID del vendedor propietario de la tienda (opcional para emprendedores sin usuario)',
		example: '64b1f2c3d4e5f6a7b8c9d0e1',
	})
	@IsString()
	@IsOptional()
	sellerId?: string;

	@ApiProperty({
		description: 'Nombre de la tienda',
		example: 'Artesanías Andinas',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Categorías de la tienda',
		enum: ShopCategory,
		isArray: true,
		example: [ShopCategory.UNKNOWN],
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(ShopCategory, { each: true })
	categories: ShopCategory[];

	@ApiProperty({
		description: 'ID del MediaItem para la imagen o ícono del emprendimiento',
		example: '67890abcdef1234567890126',
	})
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	imageOrIconMediaId: string;

	@ApiPropertyOptional({
		description: 'Datos de ProviderInfo para crear y asociar a la tienda',
		type: CreateProviderInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProviderInfoDto)
	providerInfo?: CreateProviderInfoDto;

	@ApiPropertyOptional({
		description: 'Array de IDs de seals asociados a la tienda',
		example: ['67890abcdef1234567890123', '67890abcdef1234567890124'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	seals?: string[];

	@ApiPropertyOptional({ description: 'Indica si la página pública está activa' })
	@IsOptional()
	@IsBoolean()
	activePage?: boolean;

	@ApiPropertyOptional({
		description: 'Datos de la página pública de la tienda',
		type: CreateShopPageInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateShopPageInfoDto)
	pageInfo?: CreateShopPageInfoDto;

	@ApiPropertyOptional({
		description: 'Datos del fundador de la tienda',
		type: CreateFounderInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateFounderInfoDto)
	founderInfo?: CreateFounderInfoDto;
}

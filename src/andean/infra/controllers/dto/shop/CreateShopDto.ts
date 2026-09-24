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
	ArrayMinSize,
	ArrayMaxSize,
	ValidateIf,
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

	@ApiPropertyOptional({
		description:
			'Si es true, la tienda tiene nombre y logo propios. Si es false, se usa la identidad del fundador.',
		default: true,
	})
	@IsOptional()
	@IsBoolean()
	hasBranding?: boolean;

	@ApiProperty({
		description: 'Nombre de la tienda (obligatorio si hasBranding es true)',
		example: 'Artesanías Andinas',
	})
	@ValidateIf((o: CreateShopDto) => o.hasBranding !== false)
	@IsString()
	@IsNotEmpty()
	name?: string;

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
		description:
			'ID del MediaItem para la imagen o ícono del emprendimiento (obligatorio si hasBranding es true)',
		example: '67890abcdef1234567890126',
	})
	@ValidateIf((o: CreateShopDto) => o.hasBranding !== false)
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	imageOrIconMediaId?: string;

	@ApiPropertyOptional({
		description: 'Datos de ProviderInfo para crear y asociar a la tienda',
		type: CreateProviderInfoDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProviderInfoDto)
	providerInfo?: CreateProviderInfoDto;

	@ApiProperty({
		description: 'Array de exactamente 4 IDs de seals asociados a la tienda',
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
		description: 'Indica si la página pública está activa',
	})
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

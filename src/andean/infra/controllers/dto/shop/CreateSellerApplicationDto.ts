import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayNotEmpty,
	IsEnum,
	IsOptional,
	IsMongoId,
	ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ShopCategory } from '../../../../domain/enums/ShopCategory';
import { CreateProviderInfoDto } from '../providerInfo/CreateProviderInfoDto';
import { SellerApplicationProfileDto } from './SellerApplicationProfileDto';

export class CreateSellerApplicationDto {
	@ApiProperty({
		description: 'Datos del perfil de vendedor',
		type: SellerApplicationProfileDto,
	})
	@ValidateNested()
	@Type(() => SellerApplicationProfileDto)
	@IsNotEmpty()
	seller!: SellerApplicationProfileDto;

	@ApiProperty({
		description: 'Nombre de la tienda',
		example: 'Artesanías Andinas',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Categorías de la tienda',
		enum: ShopCategory,
		isArray: true,
		example: [ShopCategory.UNKNOWN],
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(ShopCategory, { each: true })
	categories!: ShopCategory[];

	@ApiPropertyOptional({
		description: 'ID del MediaItem para la foto del artesano/emprendedor',
		example: '67890abcdef1234567890126',
	})
	@IsString()
	@IsMongoId()
	@IsOptional()
	artisanPhotoMediaId?: string;

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
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	seals?: string[];
}

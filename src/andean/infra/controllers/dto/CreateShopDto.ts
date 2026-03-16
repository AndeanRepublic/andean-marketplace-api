import { ShopCategory } from '../../../domain/enums/ShopCategory';
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
import { CreateProviderInfoDto } from './providerInfo/CreateProviderInfoDto';

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
}

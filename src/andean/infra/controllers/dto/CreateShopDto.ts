import { ShopCategory } from '../../../domain/enums/ShopCategory';
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayNotEmpty,
	IsEnum,
	IsOptional,
	IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShopDto {
	@ApiProperty({
		description: 'ID del vendedor propietario de la tienda',
		example: '64b1f2c3d4e5f6a7b8c9d0e1',
	})
	@IsString()
	@IsNotEmpty()
	sellerId: string;

	@ApiProperty({
		description: 'Nombre de la tienda',
		example: 'Artesanías Andinas',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiPropertyOptional({
		description: 'Descripción de la tienda',
		example: 'Tienda de textiles y artesanías tradicionales del Cusco',
	})
	@IsString()
	description: string;

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
		description: 'ID del ProviderInfo asociado a la tienda',
		example: '67890abcdef1234567890125',
	})
	@IsString()
	@IsMongoId()
	@IsOptional()
	providerInfoId?: string;
}

import { ShopCategory } from '../../../domain/enums/ShopCategory';
import {
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayNotEmpty,
	IsEnum,
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

	@ApiProperty({
		description: 'Políticas de la tienda (devoluciones, envíos, etc.)',
		example:
			'Se aceptan devoluciones dentro de los 7 días posteriores a la compra.',
	})
	@IsString()
	@IsNotEmpty()
	policies: string;

	@ApiProperty({
		description: 'Ciudad o región de origen de los envíos',
		example: 'Cusco, Peru',
	})
	@IsString()
	@IsNotEmpty()
	shippingOrigin: string;

	@ApiProperty({
		description: 'Área de cobertura de envíos',
		example: 'Nacional e Internacional',
	})
	@IsString()
	@IsNotEmpty()
	shippingArea: string;
}

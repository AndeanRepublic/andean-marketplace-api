import { ApiProperty } from '@nestjs/swagger';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

export class ShopResponse {
	@ApiProperty({
		description: 'ID único de la tienda',
		example: '64b1f2c3d4e5f6a7b8c9d0e1',
	})
	id: string;

	@ApiProperty({
		description: 'ID del vendedor propietario de la tienda',
		example: '64b1f2c3d4e5f6a7b8c9d0e2',
	})
	sellerId: string;

	@ApiProperty({
		description: 'Nombre de la tienda',
		example: 'Artesanías Andinas',
	})
	name: string;

	@ApiProperty({
		description: 'Descripción de la tienda',
		example: 'Tienda de textiles y artesanías tradicionales del Cusco',
	})
	description: string;

	@ApiProperty({
		description: 'Categorías de la tienda',
		enum: ShopCategory,
		isArray: true,
		example: [ShopCategory.UNKNOWN],
	})
	categories: ShopCategory[];

	@ApiProperty({
		description: 'Políticas de la tienda (devoluciones, envíos, etc.)',
		example:
			'Se aceptan devoluciones dentro de los 7 días posteriores a la compra.',
	})
	policies: string;

	@ApiProperty({
		description: 'Ciudad o región de origen de los envíos',
		example: 'Cusco, Peru',
	})
	shippingOrigin: string;

	@ApiProperty({
		description: 'Área de cobertura de envíos',
		example: 'Nacional e Internacional',
	})
	shippingArea: string;
}

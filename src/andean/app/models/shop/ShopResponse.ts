import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShopCategory } from '../../../domain/enums/ShopCategory';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

export class ShopResponse {
	@ApiProperty({
		description: 'ID único de la tienda',
		example: '64b1f2c3d4e5f6a7b8c9d0e1',
	})
	id: string;

	@ApiPropertyOptional({
		description: 'ID del vendedor propietario de la tienda (opcional para emprendedores)',
		example: '64b1f2c3d4e5f6a7b8c9d0e2',
	})
	sellerId?: string;

	@ApiProperty({
		description: 'Nombre de la tienda',
		example: 'Artesanías Andinas',
	})
	name: string;

	@ApiProperty({ description: 'Estado del emprendimiento', enum: ShopStatus })
	status: ShopStatus;

	@ApiProperty({
		description: 'Categorías de la tienda',
		enum: ShopCategory,
		isArray: true,
		example: [ShopCategory.UNKNOWN],
	})
	categories: ShopCategory[];

	@ApiProperty({
		description: 'ID del MediaItem para la imagen o ícono del emprendimiento',
	})
	imageOrIconMediaId: string;

	@ApiPropertyOptional({
		description: 'URL pública de la imagen o ícono del emprendimiento',
		example: 'https://cdn.example.com/shops/icon.jpg',
	})
	imageOrIconUrl?: string;

	@ApiPropertyOptional({
		description: 'IDs de seals asociados a la tienda',
		type: [String],
	})
	seals?: string[];

	@ApiProperty({ description: 'Indica si la página pública está activa' })
	activePage: boolean;
}

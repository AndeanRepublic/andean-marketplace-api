import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

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

	@ApiProperty({
		description: 'Categorías de la tienda',
		enum: ShopCategory,
		isArray: true,
		example: [ShopCategory.UNKNOWN],
	})
	categories: ShopCategory[];

	@ApiPropertyOptional({
		description: 'ID del MediaItem para la foto del artesano/emprendedor',
	})
	artisanPhotoMediaId?: string;
}

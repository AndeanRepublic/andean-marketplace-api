import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaInfo {
	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'superfood-image.jpg',
	})
	name!: string;

	@ApiProperty({
		description: 'URL de la imagen',
		example: 'https://example.com/image.jpg',
	})
	url!: string;
}

export class SuperfoodProductListColor {
	@ApiProperty({
		description: 'Nombre del color (catálogo)',
		example: 'Morado',
	})
	name!: string;

	@ApiProperty({ description: 'Hex del color', example: '#7c3aed' })
	hexCodeColor!: string;
}

/**
 * Fila devuelta por el aggregate de listado antes de resolver medios y color en el use case.
 */
export type SuperfoodProductListAggregateRow = Omit<
	SuperfoodProductListItem,
	'mainImage' | 'sourceProductImage' | 'color'
> & {
	colorId?: string | null;
	mainImgId?: string | null;
	sourceProductImgId?: string | null;
};

export class SuperfoodProductListItem {
	@ApiProperty({
		description: 'ID único del producto',
		example: 'uuid-1234-5678',
	})
	id!: string;

	@ApiPropertyOptional({
		description: 'Color del producto (nombre + hex desde catálogo o legado)',
		type: SuperfoodProductListColor,
	})
	color?: SuperfoodProductListColor;

	@ApiProperty({
		description: 'Título del producto',
		example: 'Quinua Orgánica Premium',
	})
	title!: string;

	@ApiProperty({
		description: 'Nombre del propietario/vendedor',
		example: 'Artesanías Cusco',
	})
	ownerName!: string;

	@ApiProperty({
		description: 'Precio del producto',
		example: 25.5,
	})
	price!: number;

	@ApiProperty({
		description: 'Stock total disponible',
		example: 40,
	})
	totalStock!: number;

	@ApiProperty({
		description: 'Imagen principal del producto',
		type: MediaInfo,
	})
	mainImage!: MediaInfo;

	@ApiProperty({
		description: 'Imagen del origen del producto',
		type: MediaInfo,
	})
	sourceProductImage!: MediaInfo;

	@ApiProperty({
		description: 'Items nutricionales destacados',
		type: [String],
		example: ['Alto en proteínas', 'Rico en hierro'],
	})
	nutritionItems!: string[];
}

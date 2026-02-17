import { ApiProperty } from '@nestjs/swagger';

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

export class SuperfoodProductListItem {
	@ApiProperty({
		description: 'ID único del producto',
		example: 'uuid-1234-5678',
	})
	id!: string;

	@ApiProperty({
		description: 'Color del producto',
		example: 'Verde',
		required: false,
	})
	color?: string;

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

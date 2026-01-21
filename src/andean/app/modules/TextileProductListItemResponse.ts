import { ApiProperty } from '@nestjs/swagger';

export class TextileProductColorInfo {
	@ApiProperty({ description: 'Nombre del color', example: 'Rojo Andino' })
	name: string;

	@ApiProperty({ description: 'Código hexadecimal del color', example: '#C41E3A' })
	colorHexCode: string;
}

export class TextileProductListItem {
	@ApiProperty({ description: 'ID único del producto', example: 'uuid-1234-5678' })
	id: string;

	@ApiProperty({ description: 'Título del producto', example: 'Poncho de Alpaca Tradicional' })
	titulo: string;

	@ApiProperty({ description: 'Nombre de la categoría', example: 'Ponchos' })
	categoryName: string;

	@ApiProperty({ description: 'Nombre del productor/vendedor', example: 'Artesanías Cusco' })
	productorName: string;

	@ApiProperty({ description: 'Lista de colores disponibles', type: [TextileProductColorInfo] })
	colors: TextileProductColorInfo[];

	@ApiProperty({ description: 'Lista de tallas disponibles', example: ['S', 'M', 'L', 'XL'] })
	tallas: string[];

	@ApiProperty({ description: 'URL de la imagen principal', example: 'https://example.com/image.jpg' })
	principalImgUrl: string;

	@ApiProperty({ description: 'Precio del producto', example: 150.00 })
	price: number;
}


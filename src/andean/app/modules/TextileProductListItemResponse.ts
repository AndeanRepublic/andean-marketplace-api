import { ApiProperty } from '@nestjs/swagger';

export class TextileProductColorInfo {
	@ApiProperty({ description: 'Nombre del color', example: 'Rojo Andino' })
	color: string;

	@ApiProperty({
		description: 'Código hexadecimal del color',
		example: '#C41E3A',
	})
	hexCode: string;

	@ApiProperty({
		description: 'URL de la imagen asociada al color',
		example: 'https://cdn.example.com/colors/rojo.jpg',
	})
	imgUrl: string;
}

export class VariantInfoListItem {
	@ApiProperty({
		description: 'ID único de la variante',
		example: '67c8f9e8a12b4f00234abcd1',
	})
	variantId: string;

	@ApiProperty({ description: 'Talla de la variante', example: 'M' })
	size: string;

	@ApiProperty({ description: 'Color de la variante', example: 'Rojo' })
	color: string;

	@ApiProperty({ description: 'Material de la variante', example: 'Algodón' })
	material: string;

	@ApiProperty({ description: 'Precio de la variante', example: 150.0 })
	price: number;

	@ApiProperty({ description: 'Stock disponible de la variante', example: 25 })
	stock: number;
}

export class TextileProductListItem {
	@ApiProperty({
		description: 'ID único del producto',
		example: 'uuid-1234-5678',
	})
	id: string;

	@ApiProperty({
		description: 'Título del producto',
		example: 'Poncho de Alpaca Tradicional',
	})
	titulo: string;

	@ApiProperty({ description: 'Nombre de la categoría', example: 'Ponchos' })
	categoryName: string;

	@ApiProperty({
		description: 'Nombre del productor/vendedor',
		example: 'Artesanías Cusco',
	})
	productorName: string;

	@ApiProperty({
		description: 'Lista de colores disponibles',
		type: [TextileProductColorInfo],
	})
	availableColors: TextileProductColorInfo[];

	@ApiProperty({
		description: 'Lista de tallas disponibles',
		example: ['S', 'M', 'L', 'XL'],
	})
	availableSizes: string[];

	@ApiProperty({
		description: 'Lista de materiales disponibles',
		example: ['Algodón', 'Lana'],
	})
	availableMaterials: string[];

	@ApiProperty({
		description: 'Información de variantes disponibles',
		type: [VariantInfoListItem],
	})
	variantInfo: VariantInfoListItem[];

	@ApiProperty({
		description: 'URL de la imagen principal',
		example: 'https://example.com/image.jpg',
	})
	principalImgUrl: string;

	@ApiProperty({ description: 'Precio del producto', example: 150.0 })
	price: number;
}

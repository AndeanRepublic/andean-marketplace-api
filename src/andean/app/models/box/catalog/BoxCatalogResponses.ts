import { ApiProperty } from '@nestjs/swagger';

export class BoxCatalogSuperfoodItemDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	title!: string;

	@ApiProperty({ description: 'Nombre de categoría superfood' })
	categoryName!: string;

	@ApiProperty({ description: 'URL de la imagen principal' })
	imgUrl!: string;

	@ApiProperty({ description: 'Precio de catálogo (basePrice)' })
	catalogPrice!: number;

	@ApiProperty()
	totalStock!: number;
}

export class BoxCatalogSuperfoodsResponseDto {
	@ApiProperty({ type: [BoxCatalogSuperfoodItemDto] })
	items!: BoxCatalogSuperfoodItemDto[];
}

export class BoxCatalogTextileItemDto {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	categoryName!: string;

	@ApiProperty()
	imgUrl!: string;

	@ApiProperty({ description: 'Precio base del producto textil' })
	catalogPrice!: number;

	@ApiProperty()
	totalStock!: number;
}

export class BoxCatalogTextilesResponseDto {
	@ApiProperty({ type: [BoxCatalogTextileItemDto] })
	items!: BoxCatalogTextileItemDto[];
}

export class BoxCatalogVariantItemDto {
	@ApiProperty()
	id!: string;

	@ApiProperty({ description: 'Etiqueta legible (opciones de la variante)' })
	label!: string;

	@ApiProperty()
	imgUrl!: string;

	@ApiProperty()
	price!: number;

	@ApiProperty()
	stock!: number;

	@ApiProperty({ type: Object, description: 'Combinación de opciones' })
	combination!: Record<string, string>;
}

export class BoxCatalogVariantsResponseDto {
	@ApiProperty({ type: [BoxCatalogVariantItemDto] })
	items!: BoxCatalogVariantItemDto[];
}

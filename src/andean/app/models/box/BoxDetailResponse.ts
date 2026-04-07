import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoxImageResponse } from './BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';

export type BoxProductType = ProductType.SUPERFOOD | ProductType.TEXTILE;

export class BoxDetailHeroResponse {
	@ApiProperty({ description: 'Nombre del box', example: 'Box Andino Premium' })
	name!: string;

	@ApiProperty({ description: 'Eslogan del box', example: 'Lo mejor de los Andes' })
	slogan!: string;

	@ApiProperty({ description: 'Imagen miniatura del box', type: BoxImageResponse })
	thumbnailImage!: BoxImageResponse;

	@ApiProperty({ description: 'Imagen principal del box', type: BoxImageResponse })
	mainImage!: BoxImageResponse;
}

export class BoxDetailDescriptionResponse {
	@ApiProperty({ description: 'Narrativa / descripción del box', example: 'Una selección curada de productos andinos tradicionales.' })
	narrative!: string;

	@ApiProperty({ description: 'Imágenes adicionales del box', type: [BoxImageResponse] })
	images!: BoxImageResponse[];
}

export class BoxContainedProductResponse {
	@ApiProperty({ description: 'ID del producto', example: '6973d8ffddef7b59c2d4dcfb' })
	id!: string;

	@ApiProperty({ description: 'Título del producto', example: 'Poncho Tradicional Andino' })
	title!: string;

	@ApiProperty({ description: 'Imagen miniatura del producto', type: BoxImageResponse })
	thumbnailImage!: BoxImageResponse;

	@ApiProperty({ description: 'Información adicional del producto', example: '500g - Orgánico certificado' })
	information!: string;

	@ApiProperty({ description: 'Tipo de producto', enum: [ProductType.SUPERFOOD, ProductType.TEXTILE], example: ProductType.TEXTILE })
	type!: BoxProductType;

	@ApiProperty({ description: 'Precio original (antes de descuento)', example: 89.99 })
	discartedPrice!: number;

	@ApiProperty({ description: 'Precio final del producto', example: 69.99 })
	price!: number;

	@ApiPropertyOptional({
		description: 'Imagen narrativa del ítem en el box',
		type: BoxImageResponse,
	})
	narrativeImage?: BoxImageResponse;
}

export class BoxPriceDetailResponse {
	@ApiProperty({ description: 'Precio original total (antes de descuento)', example: 199.99 })
	discartedPrice!: number;

	@ApiProperty({ description: 'Precio total final del box', example: 149.99 })
	totalPrice!: number;

	@ApiProperty({ description: 'Porcentaje de descuento aplicado', example: 25 })
	discountPorcentage!: number;
}

export class BoxSealDetailResponse {
	@ApiProperty({ description: 'Nombre del sello', example: 'Comercio Justo' })
	name!: string;

	@ApiProperty({ description: 'Descripción del sello', example: 'Certificación de comercio justo que garantiza condiciones laborales dignas.' })
	description!: string;

	@ApiProperty({ description: 'Logo del sello', type: BoxImageResponse })
	logo!: BoxImageResponse;
}

export class BoxDetailResponse {
	@ApiProperty({ description: 'ID único del box', example: '6973d8ffddef7b59c2d4dcfb' })
	id!: string;

	@ApiProperty({ description: 'Información del hero (nombre, eslogan e imágenes principales)', type: BoxDetailHeroResponse })
	heroDetail!: BoxDetailHeroResponse;

	@ApiProperty({ description: 'Descripción e imágenes adicionales del box', type: BoxDetailDescriptionResponse })
	detail!: BoxDetailDescriptionResponse;

	@ApiProperty({ description: 'Productos contenidos en el box', type: [BoxContainedProductResponse] })
	containedProducts!: BoxContainedProductResponse[];

	@ApiProperty({ description: 'Detalle de precios y descuento', type: BoxPriceDetailResponse })
	priceDetail!: BoxPriceDetailResponse;

	@ApiProperty({ description: 'Sellos de certificación del box', type: [BoxSealDetailResponse] })
	boxSeals!: BoxSealDetailResponse[];
}

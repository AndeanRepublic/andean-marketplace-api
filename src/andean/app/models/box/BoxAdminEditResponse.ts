import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { BoxProduct } from '../../../domain/entities/box/Box';
import {
	BoxCatalogMediaItemDto,
	BoxCatalogVariantItemDto,
} from './catalog/BoxCatalogResponses';

export class BoxAdminEditSlotDto {
	@ApiPropertyOptional({
		enum: BoxProductType,
		nullable: true,
		description: 'Tipo de la línea; null si el slot está vacío',
	})
	productType!: BoxProductType | null;

	@ApiPropertyOptional({
		nullable: true,
		description: 'ID del producto de catálogo (padre de la variante)',
	})
	productId!: string | null;

	@ApiPropertyOptional({ nullable: true })
	variantId!: string | null;

	@ApiProperty()
	productTitle!: string;

	@ApiProperty()
	categoryName!: string;

	@ApiProperty()
	variantLabel!: string;

	@ApiProperty({ description: 'Precio de catálogo de la variante' })
	catalogPrice!: number;

	@ApiProperty()
	stock!: number;

	@ApiProperty()
	imageUrl!: string;

	@ApiPropertyOptional({
		description: 'Precio por línea persistido en el box',
	})
	boxPrice?: number;

	@ApiPropertyOptional({ nullable: true })
	narrativeImgId!: string | null;

	@ApiProperty({
		type: [BoxCatalogVariantItemDto],
		description: 'Todas las variantes del producto (picker del formulario)',
	})
	variants!: BoxCatalogVariantItemDto[];

	@ApiProperty({
		type: [BoxCatalogMediaItemDto],
		description: 'Imágenes del producto para narrativeImgId',
	})
	narrativeMedia!: BoxCatalogMediaItemDto[];
}

export class BoxAdminEditResponse {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	slogan!: string;

	@ApiProperty()
	narrative!: string;

	@ApiProperty()
	thumbnailImageId!: string;

	@ApiProperty()
	mainImageId!: string;

	@ApiProperty({ type: [BoxProduct] })
	products!: BoxProduct[];

	@ApiProperty()
	price!: number;

	@ApiPropertyOptional()
	discountPercentage?: number;

	@ApiProperty({ type: [String] })
	sealIds!: string[];

	@ApiProperty({ enum: AdminEntityStatus })
	status!: AdminEntityStatus;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty({
		type: [BoxAdminEditSlotDto],
		description:
			'Tres líneas hidratadas (producto, variante, media) para el formulario de edición',
	})
	slots!: BoxAdminEditSlotDto[];
}

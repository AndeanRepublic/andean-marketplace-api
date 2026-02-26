import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

// ── Media ────────────────────────────────────────────────────────────────
export class MediaImageResponse {
	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'textile-principal.jpg',
	})
	name!: string;

	@ApiProperty({ enum: MediaItemRole, description: 'Rol del media item' })
	role!: MediaItemRole;

	@ApiProperty({
		description: 'URL de la imagen',
		example: 'https://cdn.example.com/textile.jpg',
	})
	url!: string;
}

// ── Variant Info ──────────────────────────────────────────────────────────
export class VariantInfoResponse {
	@ApiProperty({
		description: 'ID único de la variante',
		example: '67c8f9e8a12b4f00234abcd1',
	})
	variantId!: string;

	@ApiProperty({ description: 'Talla de la variante', example: 'M' })
	size!: string;

	@ApiProperty({ description: 'Color de la variante', example: 'Rojo' })
	color!: string;

	@ApiProperty({ description: 'Material de la variante', example: 'Algodón' })
	material!: string;

	@ApiProperty({ description: 'Precio de la variante', example: 150.0 })
	price!: number;

	@ApiProperty({ description: 'Stock disponible de la variante', example: 25 })
	stock!: number;
}

// ── Traceability Step ──────────────────────────────────────────────────────
export class TraceabilityStep {
	@ApiProperty({ description: 'Título del paso de trazabilidad' })
	title!: string;

	@ApiProperty({ description: 'Proveedor del paso' })
	supplier!: string;

	@ApiProperty({ description: 'País del paso' })
	country!: string;

	@ApiProperty({ description: 'Ciudad del paso' })
	city!: string;

	@ApiProperty({ description: 'Descripción del paso' })
	description!: string;
}

export class TraceabilityInfoResponse {
	@ApiPropertyOptional({ description: 'Enlace a blockchain para trazabilidad' })
	blockchainLink?: string;

	@ApiProperty({
		type: [TraceabilityStep],
		description: 'Pasos de origen del producto',
	})
	origen!: TraceabilityStep[];

	@ApiProperty({
		type: [TraceabilityStep],
		description: 'Pasos de procesamiento',
	})
	processing!: TraceabilityStep[];

	@ApiProperty({ type: [TraceabilityStep], description: 'Pasos de desarrollo' })
	development!: TraceabilityStep[];

	@ApiProperty({
		type: [TraceabilityStep],
		description: 'Pasos de merchandising',
	})
	merchandising!: TraceabilityStep[];
}

// ── Review ────────────────────────────────────────────────────────────────
export class ReviewRatingResponse {
	@ApiProperty({ description: 'Cantidad de reseñas con 5 estrellas' })
	count5stars!: number;

	@ApiProperty({ description: 'Cantidad de reseñas con 4 estrellas' })
	count4stars!: number;

	@ApiProperty({ description: 'Cantidad de reseñas con 3 estrellas' })
	count3stars!: number;

	@ApiProperty({ description: 'Cantidad de reseñas con 2 estrellas' })
	count2stars!: number;

	@ApiProperty({ description: 'Cantidad de reseñas con 1 estrella' })
	count1star!: number;

	@ApiProperty({ description: 'Total de reseñas' })
	totalReviews!: number;

	@ApiProperty({ description: 'Puntuación promedio' })
	averagePunctuation!: number;
}

export class ReviewCommentResponse {
	@ApiProperty({ description: 'ID de la reseña' })
	idReview!: string;

	@ApiProperty({ description: 'Nombre del usuario que hizo la reseña' })
	nameUser!: string;

	@ApiProperty({ description: 'Contenido de la reseña' })
	content!: string;

	@ApiProperty({ description: 'Número de estrellas de la reseña' })
	numberStarts!: number;

	@ApiProperty({ description: 'Fecha de la reseña' })
	date!: Date;

	@ApiProperty({ description: 'Cantidad de likes' })
	likes!: number;

	@ApiProperty({ description: 'Cantidad de dislikes' })
	dislikes!: number;
}

export class ReviewsResponse {
	@ApiProperty({
		type: ReviewRatingResponse,
		description: 'Información de calificaciones',
	})
	rating!: ReviewRatingResponse;

	@ApiProperty({
		type: [ReviewCommentResponse],
		description: 'Comentarios de las reseñas',
	})
	comments!: ReviewCommentResponse[];
}

// ── Similar Product ───────────────────────────────────────────────────────
export class ColorInfoResponse {
	@ApiProperty({ description: 'Nombre del color', example: 'Rojo' })
	colorName!: string;

	@ApiProperty({
		description: 'Código hexadecimal del color',
		example: '#FF0000',
	})
	colorHexCode!: string;
}

export class SimilarProductResponse {
	@ApiProperty({
		description: 'ID único del producto similar',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	id!: string;

	@ApiProperty({ description: 'Título del producto similar' })
	title!: string;

	@ApiProperty({ description: 'Nombre de la categoría' })
	categoryName!: string;

	@ApiProperty({ description: 'Nombre del productor' })
	productorName!: string;

	@ApiProperty({
		type: [ColorInfoResponse],
		description: 'Colores disponibles',
	})
	colors!: ColorInfoResponse[];

	@ApiProperty({ type: [String], description: 'Tallas disponibles' })
	sizes!: string[];

	@ApiProperty({ description: 'URL de la imagen principal' })
	principalImgUrl!: string;

	@ApiProperty({ description: 'Precio del producto' })
	price!: number;
}

// ── Community Info ────────────────────────────────────────────────────────
export class SealInfoResponse {
	@ApiProperty({ description: 'Título del sello' })
	title!: string;

	@ApiProperty({ description: 'Descripción del sello' })
	description!: string;

	@ApiProperty({ description: 'ID del media del logo del sello' })
	logoMediaId!: string;
}

export class CommunityInfoResponse {
	@ApiProperty({ description: 'ID de la imagen del banner de la comunidad' })
	bannerImageId!: string;

	@ApiProperty({ description: 'Nombre de la comunidad' })
	name!: string;

	@ApiProperty({
		type: [SealInfoResponse],
		description: 'Sellos de la comunidad',
	})
	seals!: SealInfoResponse[];
}

// ── Main response ────────────────────────────────────────────────────────
export class TextileProductDetailResponse {
	@ApiProperty({
		description: 'ID único del producto textil',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	id!: string;

	@ApiProperty({ description: 'Nombre del producto textil' })
	name!: string;

	@ApiProperty({
		type: [MediaImageResponse],
		description: 'Imágenes del producto',
	})
	images!: MediaImageResponse[];

	@ApiProperty({ type: [String], description: 'Tallas disponibles' })
	availableSizes!: string[];

	@ApiProperty({ type: [String], description: 'Colores disponibles' })
	availableColors!: string[];

	@ApiProperty({ type: [String], description: 'Materiales disponibles' })
	availableMaterials!: string[];

	@ApiProperty({
		type: [VariantInfoResponse],
		description: 'Información de variantes disponibles',
	})
	variantInfo!: VariantInfoResponse[];

	@ApiProperty({ description: 'Stock general del producto' })
	generalStock!: number;

	@ApiProperty({ description: 'Información del producto' })
	information!: string;

	@ApiProperty({ description: 'Descripción del producto' })
	description!: string;

	@ApiProperty({
		type: TraceabilityInfoResponse,
		description: 'Información de trazabilidad',
	})
	traceabilityInfo!: TraceabilityInfoResponse;

	@ApiProperty({ type: ReviewsResponse, description: 'Reseñas del producto' })
	reviews!: ReviewsResponse;

	@ApiProperty({
		type: [SimilarProductResponse],
		description: 'Productos similares',
	})
	similarProducts!: SimilarProductResponse[];

	@ApiPropertyOptional({
		type: CommunityInfoResponse,
		description: 'Información de la comunidad asociada',
	})
	communityInfo?: CommunityInfoResponse;
}

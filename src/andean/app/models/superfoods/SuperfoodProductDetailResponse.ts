import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SuperfoodProductListColor } from './SuperfoodProductListItem';
import { OwnerInfoResponse } from '../textile/TextileProductDetailResponse';
import { ProductTraceabilityResponse } from '../shared/ProductTraceabilityResponse';

// ── Media ────────────────────────────────────────────────────────────────
export class MediaImageResponse {
	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'quinua-principal.jpg',
	})
	name!: string;

	@ApiProperty({
		description: 'URL de la imagen',
		example: 'https://cdn.example.com/quinua.jpg',
	})
	url!: string;
}

// ── Nutritional Feature (hero) ───────────────────────────────────────────
export class NutritionalFeatureInfo {
	@ApiProperty() id!: string;
	@ApiProperty() name!: string;
	@ApiProperty({
		description: 'URL pública del icono (resuelta desde el MediaItem)',
	})
	iconUrl!: string;
}

// ── Hero Detail ──────────────────────────────────────────────────────────
export class HeroDetailResponse {
	@ApiProperty() title!: string;
	@ApiPropertyOptional({
		description: 'Resumen breve (si existe en el producto)',
	})
	shortDescription?: string;
	@ApiProperty() description!: string;
	@ApiProperty({ type: [NutritionalFeatureInfo] })
	nutritionalFeatures!: NutritionalFeatureInfo[];
	@ApiProperty() basePrice!: number;
	@ApiProperty() totalStock!: number;
	@ApiProperty() isDiscountActive!: boolean;
	@ApiProperty({
		type: [String],
		description: 'Rasgos generales del producto (máx. 3) para pills del hero',
		example: ['Handmade', 'Organic', 'Andean community'],
	})
	generalFeatures!: string[];
	@ApiPropertyOptional({
		description: 'SKU del inventario (código Identi cuando blockchainActive)',
		example: 'SF-QUI-001',
	})
	sku?: string;
}

// ── Benefit ──────────────────────────────────────────────────────────────
export class BenefitInfoResponse {
	@ApiProperty() id!: string;
	@ApiProperty() name!: string;
	@ApiProperty({
		description: 'URL pública del icono (resuelta desde el MediaItem)',
	})
	iconUrl!: string;
	@ApiPropertyOptional() description?: string;
	@ApiProperty() color!: string;
}

// ── Source product ───────────────────────────────────────────────────────
export class SourceProductInfoResponse {
	@ApiProperty() name!: string;
	@ApiProperty() description!: string;
	@ApiProperty({ type: [String] }) features!: string[];
}

// ── Nutritional items ────────────────────────────────────────────────────
export class StrikingNutritionalItemResponse {
	@ApiProperty() quantityNumber!: number;
	@ApiProperty({ enum: ['g', 'mg', 'µg', 'kcal', 'cal', 'kJ'] })
	quantityUnit!: 'g' | 'mg' | 'µg' | 'kcal' | 'cal' | 'kJ';
	@ApiProperty() name!: string;
	@ApiProperty() strikingFeature!: string;
}

export class NutritionalItemResponse {
	@ApiProperty() quantityNumber!: number;
	@ApiProperty({ enum: ['g', 'mg', 'µg', 'kcal', 'cal', 'kJ'] })
	quantityUnit!: 'g' | 'mg' | 'µg' | 'kcal' | 'cal' | 'kJ';
	@ApiProperty() name!: string;
}

// ── Review ───────────────────────────────────────────────────────────────
export class ReviewRatingResponse {
	@ApiProperty() count5stars!: number;
	@ApiProperty() count4stars!: number;
	@ApiProperty() count3stars!: number;
	@ApiProperty() count2stars!: number;
	@ApiProperty() count1star!: number;
	@ApiProperty() totalReviews!: number;
	@ApiProperty() averagePunctuation!: number;
}

export class ReviewCommentResponse {
	@ApiProperty() idReview!: string;
	@ApiProperty() nameUser!: string;
	@ApiProperty() content!: string;
	@ApiProperty() numberStars!: number;
	@ApiProperty() date!: Date;
	@ApiProperty() likes!: number;
	@ApiProperty() dislikes!: number;

	@ApiPropertyOptional({
		description: 'Voto del usuario autenticado en la reseña',
		enum: ['like', 'dislike', null],
	})
	userVote?: 'like' | 'dislike' | null;
}

export class ReviewsResponse {
	@ApiProperty({ type: ReviewRatingResponse }) rating!: ReviewRatingResponse;
	@ApiProperty({ type: [ReviewCommentResponse] })
	comments!: ReviewCommentResponse[];
}

export class SuperfoodDetailVariantResponse {
	@ApiProperty({ description: 'Id de la entidad Variant' })
	variantId!: string;

	@ApiProperty({ example: '500 g' })
	label!: string;

	@ApiProperty()
	price!: number;

	@ApiProperty()
	stock!: number;

	@ApiPropertyOptional({ example: 'SF-QUI-001-500G' })
	sku?: string;
}

// ── Main response ────────────────────────────────────────────────────────
export class SuperfoodProductDetailResponse {
	@ApiProperty() id!: string;

	@ApiProperty({ type: MediaImageResponse }) mainImg!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse }) plateImg!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse })
	sourceProductImg!: MediaImageResponse;

	@ApiPropertyOptional({
		type: MediaImageResponse,
		description: 'Imagen más cercana del producto fuente',
	})
	closestSourceProductImg?: MediaImageResponse;

	@ApiPropertyOptional({
		type: [MediaImageResponse],
		description: 'Otras imágenes del producto',
	})
	otherProductImages?: MediaImageResponse[];

	@ApiProperty({ type: HeroDetailResponse }) heroDetail!: HeroDetailResponse;
	@ApiPropertyOptional({ type: OwnerInfoResponse })
	ownerInfo?: OwnerInfoResponse;

	@ApiProperty({ type: [BenefitInfoResponse] })
	benefitsInfo!: BenefitInfoResponse[];
	@ApiProperty({ type: SourceProductInfoResponse })
	sourceProductInfo!: SourceProductInfoResponse;

	@ApiProperty({ type: [StrikingNutritionalItemResponse] })
	strikingNutritionalItems!: StrikingNutritionalItemResponse[];
	@ApiProperty({ type: [NutritionalItemResponse] })
	nutritionalInformation!: NutritionalItemResponse[];

	@ApiProperty({ description: 'Productos similares (máximo 6)' })
	moreProducts!: SuperfoodProductListItemCompact[];
	@ApiProperty({ type: ReviewsResponse }) reviews!: ReviewsResponse;

	@ApiPropertyOptional({
		type: SuperfoodProductListColor,
		description: 'Color de catálogo resuelto (nombre + hex)',
	})
	color?: SuperfoodProductListColor;

	@ApiPropertyOptional({ description: 'Estado del producto' })
	status?: string;

	@ApiPropertyOptional({
		type: ProductTraceabilityResponse,
		description: 'Trazabilidad blockchain/epochs',
	})
	productTraceability?: ProductTraceabilityResponse;

	@ApiPropertyOptional()
	isDiscountActive?: boolean;

	@ApiProperty({
		type: [SuperfoodDetailVariantResponse],
		description: 'Variantes SIZE para el hero y el carrito',
	})
	variants!: SuperfoodDetailVariantResponse[];
}

// ── Compact list item (for moreProducts) ─────────────────────────────────
export class SuperfoodProductListItemCompact {
	@ApiProperty() id!: string;
	@ApiPropertyOptional({ type: SuperfoodProductListColor })
	color?: SuperfoodProductListColor;
	@ApiProperty() title!: string;
	@ApiProperty() ownerName!: string;
	@ApiProperty() price!: number;
	@ApiProperty() totalStock!: number;
	@ApiProperty({ type: MediaImageResponse }) mainImage!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse })
	productPackageOutImage!: MediaImageResponse;
	@ApiProperty({ type: [String] }) nutritionItems!: string[];
}

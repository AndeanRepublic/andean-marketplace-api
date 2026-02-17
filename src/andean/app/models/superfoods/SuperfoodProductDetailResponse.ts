import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Media ────────────────────────────────────────────────────────────────
export class MediaImageResponse {
	@ApiProperty({ description: 'Nombre del archivo', example: 'quinua-principal.jpg' })
	name!: string;

	@ApiProperty({ description: 'URL de la imagen', example: 'https://cdn.example.com/quinua.jpg' })
	url!: string;
}

// ── Nutritional Feature (hero) ───────────────────────────────────────────
export class NutritionalFeatureInfo {
	@ApiProperty() id!: string;
	@ApiProperty() name!: string;
	@ApiProperty() iconUrl!: string;
}

// ── Traceability step ────────────────────────────────────────────────────
export class TraceabilityStep {
	@ApiProperty() title!: string;
	@ApiProperty() supplier!: string;
	@ApiProperty() country!: string;
	@ApiProperty() city!: string;
	@ApiProperty() description!: string;
}

export class TraceabilityInfoResponse {
	@ApiPropertyOptional() blockchainLink?: string;
	@ApiProperty({ type: [TraceabilityStep] }) origen!: TraceabilityStep[];
	@ApiProperty({ type: [TraceabilityStep] }) processing!: TraceabilityStep[];
	@ApiProperty({ type: [TraceabilityStep] }) development!: TraceabilityStep[];
	@ApiProperty({ type: [TraceabilityStep] }) merchandising!: TraceabilityStep[];
}

// ── Hero Detail ──────────────────────────────────────────────────────────
export class HeroDetailResponse {
	@ApiProperty() title!: string;
	@ApiProperty() description!: string;
	@ApiProperty({ type: [NutritionalFeatureInfo] }) nutritionalFeatures!: NutritionalFeatureInfo[];
	@ApiProperty() basePrice!: number;
	@ApiProperty() totalStock!: number;
	@ApiProperty() isDiscountActive!: boolean;
	@ApiProperty({ type: TraceabilityInfoResponse }) traceabilityInfo!: TraceabilityInfoResponse;
}

// ── Owner ────────────────────────────────────────────────────────────────
export class OwnerInfoResponse {
	@ApiProperty() id!: string;
	@ApiProperty() type!: string;
	@ApiProperty() name!: string;
	@ApiProperty() imgUrl!: string;
}

// ── Benefit ──────────────────────────────────────────────────────────────
export class BenefitInfoResponse {
	@ApiProperty() id!: string;
	@ApiProperty() name!: string;
	@ApiProperty() iconUrl!: string;
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
	@ApiProperty() id!: string;
	@ApiProperty() quantity!: string;
	@ApiProperty() name!: string;
	@ApiProperty() strikingFeature!: string;
}

export class NutritionalItemResponse {
	@ApiProperty() id!: string;
	@ApiProperty() quantity!: string;
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
	@ApiProperty() numberStarts!: number;
	@ApiProperty() date!: Date;
	@ApiProperty() likes!: number;
	@ApiProperty() dislikes!: number;
}

export class ReviewsResponse {
	@ApiProperty({ type: ReviewRatingResponse }) rating!: ReviewRatingResponse;
	@ApiProperty({ type: [ReviewCommentResponse] }) comments!: ReviewCommentResponse[];
}

// ── Main response ────────────────────────────────────────────────────────
export class SuperfoodProductDetailResponse {
	@ApiProperty() id!: string;

	@ApiProperty({ type: MediaImageResponse }) mainImg!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse }) plateImg!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse }) sourceProductImg!: MediaImageResponse;

	@ApiProperty({ type: HeroDetailResponse }) heroDetail!: HeroDetailResponse;
	@ApiProperty({ type: OwnerInfoResponse }) owner!: OwnerInfoResponse;

	@ApiProperty({ type: [BenefitInfoResponse] }) benefitsInfo!: BenefitInfoResponse[];
	@ApiProperty({ type: SourceProductInfoResponse }) sourceProductInfo!: SourceProductInfoResponse;

	@ApiProperty({ type: [StrikingNutritionalItemResponse] }) strikingNutritionalItems!: StrikingNutritionalItemResponse[];
	@ApiProperty({ type: [NutritionalItemResponse] }) nutritionalInformation!: NutritionalItemResponse[];

	@ApiProperty({ description: 'Productos similares (máximo 6)' }) moreProducts!: SuperfoodProductListItemCompact[];
	@ApiProperty({ type: ReviewsResponse }) reviews!: ReviewsResponse;
}

// ── Compact list item (for moreProducts) ─────────────────────────────────
export class SuperfoodProductListItemCompact {
	@ApiProperty() id!: string;
	@ApiPropertyOptional() color?: string;
	@ApiProperty() title!: string;
	@ApiProperty() ownerName!: string;
	@ApiProperty() price!: number;
	@ApiProperty() totalStock!: number;
	@ApiProperty({ type: MediaImageResponse }) mainImage!: MediaImageResponse;
	@ApiProperty({ type: MediaImageResponse }) sourceProductImage!: MediaImageResponse;
	@ApiProperty({ type: [String] }) nutritionItems!: string[];
}

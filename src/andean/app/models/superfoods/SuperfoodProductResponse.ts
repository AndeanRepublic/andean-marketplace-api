import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';
import { SuperfoodConsumptionWay } from '../../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../../domain/enums/SuperfoodProductionMethod';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';
import { ProductTraceabilityResponse } from '../shared/ProductTraceabilityResponse';

export class SuperfoodBasicInfoResponse {
	@ApiProperty({ description: 'Título del superfood' })
	title!: string;

	@ApiProperty({ description: 'IDs de MediaItems', type: [String] })
	mediaIds!: string[];

	@ApiProperty({ description: 'Descripción del producto' })
	description!: string;

	@ApiProperty({ description: 'Características generales', type: [String] })
	general_features!: string[];

	@ApiProperty({
		description: 'IDs de características nutricionales',
		type: [String],
	})
	nutritional_features!: string[];

	@ApiProperty({ description: 'IDs de beneficios', type: [String] })
	benefits!: string[];

	@ApiProperty({ enum: SuperfoodOwnerType, description: 'Tipo de dueño' })
	ownerType!: SuperfoodOwnerType;

	@ApiProperty({ description: 'ID del dueño (Shop o Community)' })
	ownerId!: string;
}

export class SuperfoodPriceInventoryResponse {
	@ApiProperty({ description: 'Precio base del producto' })
	basePrice!: number;

	@ApiProperty({ description: 'Stock total disponible' })
	totalStock!: number;

	@ApiProperty({ description: 'Código SKU del producto' })
	SKU!: string;
}

export class SuperfoodDetailProductResponse {
	@ApiProperty({ description: 'ID de tipo de superfood', required: false })
	type?: string;

	@ApiProperty({
		description: 'ID de presentación del producto',
		required: false,
	})
	productPresentation?: string;

	@ApiProperty({
		enum: SuperfoodConsumptionWay,
		description: 'Forma de consumo',
		required: false,
	})
	consumptionWay?: SuperfoodConsumptionWay;

	@ApiProperty({ description: 'Sugerencias de consumo', required: false })
	consumptionSuggestions?: string;

	@ApiProperty({
		description: 'ID de tamaño de unidad de venta',
		required: false,
	})
	salesUnitSize?: string;

	@ApiProperty({ description: 'Recomendaciones médicas', required: false })
	medicRecommendations?: string;

	@ApiProperty({ description: 'Advertencias de salud', required: false })
	healthWarnings?: string;
}

export class SuperfoodNutritionalItemResponse {
	@ApiProperty({ description: 'ID del item nutricional' })
	id!: string;

	@ApiProperty({ description: 'Cantidad del nutriente', example: '20g' })
	quantity!: string;

	@ApiProperty({ description: 'Nombre del nutriente', example: 'Proteína' })
	nutrient!: string;

	@ApiProperty({ description: 'Característica destacada' })
	strikingFeature!: string;

	@ApiProperty({ description: 'Si está seleccionado como destacado' })
	selected!: boolean;
}

export class SuperfoodProductDimensionsResponse {
	@ApiProperty({ description: 'Largo (cm)' })
	length!: number;

	@ApiProperty({ description: 'Ancho (cm)' })
	width!: number;

	@ApiProperty({ description: 'Alto (cm)' })
	height!: number;
}

export class SuperfoodDetailTraceabilityResponse {
	@ApiProperty({ required: false })
	productOrigin?: string;

	@ApiProperty({ required: false })
	exactSpeciesOrVarietyId?: string;

	@ApiProperty({
		enum: SuperfoodProductionMethod,
		required: false,
	})
	productionMethod?: SuperfoodProductionMethod;

	@ApiProperty({ required: false })
	preservationMethodId?: string;

	@ApiProperty({ type: [String], required: false })
	certificationIds?: string[];

	@ApiProperty({ required: false })
	sanitaryRegistryNumber?: string;

	@ApiProperty({ required: false })
	expirationDate?: Date;

	@ApiProperty({ required: false })
	productionDate?: Date;

	@ApiProperty({ required: false })
	lotNumber?: string;

	@ApiProperty({ required: false })
	isNatural?: boolean;

	@ApiProperty({ required: false })
	isArtesanal?: boolean;

	@ApiProperty({ required: false })
	isEatableWithoutPrep?: boolean;

	@ApiProperty({ required: false })
	canCauseAllergies?: boolean;

	@ApiProperty({ type: [String], required: false })
	allergens?: string[];

	@ApiProperty({ required: false })
	primaryPackaging?: string;

	@ApiProperty({ required: false })
	secondaryPackaging?: string;

	@ApiProperty({ required: false })
	packagingSpecification?: string;

	@ApiProperty({ required: false })
	netWeight?: string;

	@ApiProperty({ required: false })
	grossWeight?: string;

	@ApiPropertyOptional({
		type: () => SuperfoodProductDimensionsResponse,
		description: 'Dimensiones del empaque (cm)',
	})
	dimensionsWithPackage?: SuperfoodProductDimensionsResponse;

	@ApiProperty({ required: false })
	storageConditions?: string;

	@ApiProperty({ required: false })
	estimatedDeliveryDays?: number;

	@ApiProperty({ required: false })
	isCustomizableOrMixable?: boolean;
}

export class SuperfoodOptionsItemResponse {
	@ApiProperty({ description: 'ID del item de opción' })
	id!: string;

	@ApiProperty({ description: 'Etiqueta del item', example: 'Rojo' })
	label!: string;

	@ApiProperty({
		description: 'URLs de imágenes del item',
		type: [String],
		required: false,
	})
	images?: string[];
}

export class SuperfoodOptionsResponse {
	@ApiProperty({ description: 'ID de la opción' })
	id!: string;

	@ApiProperty({ description: 'Nombre de la opción', example: 'Color' })
	name!: string;

	@ApiProperty({
		description: 'Valores de la opción',
		type: [SuperfoodOptionsItemResponse],
	})
	values!: SuperfoodOptionsItemResponse[];
}

export class SuperfoodProductResponse {
	@ApiProperty({ description: 'ID único del producto' })
	id!: string;

	@ApiPropertyOptional({ description: 'ID de categoría de superfood' })
	categoryId?: string;

	@ApiProperty({
		enum: SuperfoodProductStatus,
		description: 'Estado del producto',
	})
	status!: SuperfoodProductStatus;

	@ApiProperty({
		type: SuperfoodBasicInfoResponse,
		description: 'Información básica del producto',
	})
	baseInfo!: SuperfoodBasicInfoResponse;

	@ApiProperty({
		type: SuperfoodPriceInventoryResponse,
		description: 'Precio e inventario',
	})
	priceInventory!: SuperfoodPriceInventoryResponse;

	@ApiPropertyOptional({
		type: SuperfoodDetailProductResponse,
		description: 'Detalles del producto',
	})
	detailProduct?: SuperfoodDetailProductResponse;

	@ApiPropertyOptional({
		type: [SuperfoodNutritionalItemResponse],
		description: 'Contenido nutricional',
	})
	nutritionalContent?: SuperfoodNutritionalItemResponse[];

	@ApiPropertyOptional({
		type: SuperfoodDetailTraceabilityResponse,
		description: 'Datos internos de gestión y trazabilidad',
	})
	detailTraceability?: SuperfoodDetailTraceabilityResponse;

	@ApiPropertyOptional({
		type: ProductTraceabilityResponse,
		description: 'Trazabilidad por etapas / blockchain',
	})
	productTraceability?: ProductTraceabilityResponse;

	@ApiPropertyOptional({
		type: [SuperfoodOptionsResponse],
		description: 'Opciones del producto (variantes)',
	})
	options?: SuperfoodOptionsResponse[];

	@ApiPropertyOptional({
		description: 'ID de color de catálogo (SuperfoodColor)',
	})
	colorId?: string;

	@ApiPropertyOptional({
		description: 'ID del producto fuente de detalle (DetailSourceProduct)',
	})
	detailSourceProductId?: string;

	@ApiProperty({
		description: 'Indica si el descuento está activo para este producto',
	})
	isDiscountActive!: boolean;

	@ApiProperty({ description: 'Fecha de creación', type: String, format: 'date-time' })
	createdAt!: Date;

	@ApiProperty({
		description: 'Fecha de última actualización',
		type: String,
		format: 'date-time',
	})
	updatedAt!: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { SuperfoodProductStatus } from '../../domain/enums/SuperfoodProductStatus';
import { SuperfoodConsumptionWay } from '../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../domain/enums/SuperfoodProductionMethod';
import { SuperfoodOwnerType } from '../../domain/enums/SuperfoodOwnerType';

export class SuperfoodBasicInfoResponse {
	@ApiProperty({ description: 'Título del superfood' })
	title: string;

	@ApiProperty({ description: 'IDs de MediaItems', type: [String] })
	mediaIds: string[];

	@ApiProperty({ description: 'Descripción del producto' })
	description: string;

	@ApiProperty({ description: 'Características generales', type: [String] })
	general_features: string[];

	@ApiProperty({ description: 'IDs de características nutricionales', type: [String] })
	nutritional_features: string[];

	@ApiProperty({ description: 'IDs de beneficios', type: [String] })
	benefits: string[];

	@ApiProperty({ enum: SuperfoodOwnerType, description: 'Tipo de dueño' })
	ownerType: SuperfoodOwnerType;

	@ApiProperty({ description: 'ID del dueño (Shop o Community)' })
	ownerId: string;
}

export class SuperfoodPriceInventoryResponse {
	@ApiProperty({ description: 'Precio base del producto' })
	basePrice: number;

	@ApiProperty({ description: 'Stock total disponible' })
	totalStock: number;

	@ApiProperty({ description: 'Código SKU del producto' })
	SKU: string;
}

export class SuperfoodElaborationTimeResponse {
	@ApiProperty({ description: 'Días de elaboración' })
	days: number;

	@ApiProperty({ description: 'Horas de elaboración' })
	hours: number;
}

export class SuperfoodDetailProductResponse {
	@ApiProperty({ description: 'ID de tipo de superfood' })
	type: string;

	@ApiProperty({ description: 'ID de presentación del producto' })
	productPresentation: string;

	@ApiProperty({ enum: SuperfoodConsumptionWay, description: 'Forma de consumo' })
	consumptionWay: SuperfoodConsumptionWay;

	@ApiProperty({ description: 'Sugerencias de consumo', required: false })
	consumptionSuggestions?: string;

	@ApiProperty({ description: 'ID de tamaño de unidad de venta' })
	salesUnitSize: string;

	@ApiProperty({ description: 'Recomendaciones médicas', required: false })
	medicRecommendations?: string;

	@ApiProperty({ description: 'Advertencias de salud', required: false })
	healthWarnings?: string;

	@ApiProperty({ type: SuperfoodElaborationTimeResponse, description: 'Tiempo de elaboración' })
	elaborationTime: SuperfoodElaborationTimeResponse;
}

export class SuperfoodNutritionalItemResponse {
	@ApiProperty({ description: 'ID del item nutricional' })
	id: string;

	@ApiProperty({ description: 'Cantidad del nutriente', example: '20g' })
	quantity: string;

	@ApiProperty({ description: 'Nombre del nutriente', example: 'Proteína' })
	nutrient: string;

	@ApiProperty({ description: 'Característica destacada' })
	strikingFeature: string;

	@ApiProperty({ description: 'Si está seleccionado como destacado' })
	selected: boolean;
}

export class SuperfoodDetailTraceabilityResponse {
	@ApiProperty({ description: 'Si es hecho a mano' })
	handmade: boolean;

	@ApiProperty({ description: 'Materiales secundarios usados', type: [String] })
	secondaryMaterials: string[];

	@ApiProperty({ description: 'ID de la comunidad de origen del producto' })
	originProductCommunityId: string;

	@ApiProperty({ enum: SuperfoodProductionMethod, description: 'Método de producción' })
	productionMethod: SuperfoodProductionMethod;

	@ApiProperty({ description: 'ID de método de preservación' })
	preservationMethod: string;

	@ApiProperty({ description: 'Si es artesanal' })
	isArtesanal: boolean;

	@ApiProperty({ description: 'Si es natural' })
	isNatural: boolean;

	@ApiProperty({ description: 'Si se puede comer sin preparación' })
	isEatableWithoutPrep: boolean;

	@ApiProperty({ description: 'Si puede causar alergias' })
	canCauseAllergies: boolean;

	@ApiProperty({ description: 'ID de certificación', required: false })
	certification?: string;
}

export class SuperfoodOptionsItemResponse {
	@ApiProperty({ description: 'ID del item de opción' })
	id: string;

	@ApiProperty({ description: 'Etiqueta del item', example: 'Rojo' })
	label: string;

	@ApiProperty({ description: 'URLs de imágenes del item', type: [String], required: false })
	images?: string[];
}

export class SuperfoodOptionsResponse {
	@ApiProperty({ description: 'ID de la opción' })
	id: string;

	@ApiProperty({ description: 'Nombre de la opción', example: 'Color' })
	name: string;

	@ApiProperty({ description: 'Valores de la opción', type: [SuperfoodOptionsItemResponse] })
	values: SuperfoodOptionsItemResponse[];
}

export class SuperfoodVariantResponse {
	@ApiProperty({ description: 'ID de la variante' })
	id: string;

	@ApiProperty({
		description: 'Combinación de opciones',
		example: { "opt_color": "id_option", "opt_size": "id_size" }
	})
	combination: Record<string, string>;

	@ApiProperty({ description: 'Precio de la variante' })
	price: number;

	@ApiProperty({ description: 'Stock de la variante' })
	stock: number;
}

export class SuperfoodProductResponse {
	@ApiProperty({ description: 'ID único del producto' })
	id: string;

	@ApiProperty({ description: 'ID de categoría de superfood' })
	categoryId: string;

	@ApiProperty({ enum: SuperfoodProductStatus, description: 'Estado del producto' })
	status: SuperfoodProductStatus;

	@ApiProperty({ type: SuperfoodBasicInfoResponse, description: 'Información básica del producto' })
	baseInfo: SuperfoodBasicInfoResponse;

	@ApiProperty({ type: SuperfoodPriceInventoryResponse, description: 'Precio e inventario' })
	priceInventory: SuperfoodPriceInventoryResponse;

	@ApiProperty({ type: SuperfoodDetailProductResponse, description: 'Detalles del producto' })
	detailProduct: SuperfoodDetailProductResponse;

	@ApiProperty({ type: [SuperfoodNutritionalItemResponse], description: 'Contenido nutricional' })
	nutritionalContent: SuperfoodNutritionalItemResponse[];

	@ApiProperty({ type: SuperfoodDetailTraceabilityResponse, description: 'Detalles de trazabilidad' })
	detailTraceability: SuperfoodDetailTraceabilityResponse;

	@ApiProperty({ description: 'Trazabilidad general del producto', required: false })
	productTraceability?: any;

	@ApiProperty({ type: [SuperfoodOptionsResponse], description: 'Opciones del producto' })
	options: SuperfoodOptionsResponse[];

	@ApiProperty({ type: [SuperfoodVariantResponse], description: 'Variantes del producto' })
	variants: SuperfoodVariantResponse[];

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}

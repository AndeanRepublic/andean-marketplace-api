import { Document, Schema } from 'mongoose';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';
import { SuperfoodConsumptionWay } from '../../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../../domain/enums/SuperfoodProductionMethod';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { ProductCurrency } from '../../../domain/enums/ProductCurrency';
import { TraceabilityProcessName } from '../../../domain/enums/TraceabilityProcessName';

// Nested schemas
const SuperfoodOptionsItemSchema = new Schema({
	id: { type: String, required: true },
	label: { type: String, required: true },
	mediaIds: { type: [String], default: [] },
});

const SuperfoodOptionsSchema = new Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	values: { type: [SuperfoodOptionsItemSchema], default: [] },
});

const SuperfoodProductMediaSchema = new Schema(
	{
		mainImgId: { type: String, required: true },
		plateImgId: { type: String, required: false },
		sourceProductImgId: { type: String, required: false },
		closestSourceProductImgId: { type: String, required: false },
		otherImagesId: { type: [String], default: [] },
	},
	{ _id: false },
);

const SuperfoodBasicInfoSchema = new Schema(
	{
		title: { type: String, required: true },
		productMedia: {
			type: SuperfoodProductMediaSchema,
			required: true,
		},
		shortDescription: { type: String, required: true },
		detailedDescription: { type: String, required: true },
		general_features: { type: [String], default: [] },
		nutritional_features: { type: [String], default: [] }, // IDs
		benefits: { type: [String], default: [] }, // IDs
		ownerType: {
			type: String,
			enum: Object.values(OwnerType),
			required: true,
		},
		ownerId: { type: String, required: true },
	},
	{ _id: false },
);

const SuperfoodPriceInventorySchema = new Schema(
	{
		basePrice: { type: Number, required: true },
		totalStock: { type: Number, required: true },
		currency: {
			type: String,
			enum: Object.values(ProductCurrency),
			required: true,
			default: ProductCurrency.PEN,
		},
		SKU: { type: String, required: false },
	},
	{ _id: false },
);

const SuperfoodNutritionalItemSchema = new Schema({
	id: { type: String, required: true },
	quantity: { type: String, required: true },
	nutrient: { type: String, required: true },
	strikingFeature: { type: String, required: true },
	selected: { type: Boolean, default: false },
});

const SuperfoodProductDimensionsSchema = new Schema(
	{
		length: { type: Number, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
	},
	{ _id: false },
);

const SuperfoodDetailTraceabilitySchema = new Schema(
	{
		productOrigin: { type: String, required: false },
		exactSpeciesOrVarietyId: { type: String, required: false },
		productionMethod: {
			type: String,
			enum: Object.values(SuperfoodProductionMethod),
			required: false,
		},
		preservationMethodId: { type: String, required: false },
		certificationIds: { type: [String], default: [] },
		sanitaryRegistryNumber: { type: String, required: false },
		expirationDate: { type: Date, required: false },
		productionDate: { type: Date, required: false },
		lotNumber: { type: String, required: false },
		isNatural: { type: Boolean, required: false },
		isArtesanal: { type: Boolean, required: false },
		isEatableWithoutPrep: { type: Boolean, required: false },
		canCauseAllergies: { type: Boolean, required: false },
		allergens: { type: [String], default: [] },
		primaryPackaging: { type: String, required: false },
		secondaryPackaging: { type: String, required: false },
		packagingSpecification: { type: String, required: false },
		netWeight: { type: String, required: false },
		grossWeight: { type: String, required: false },
		dimensionsWithPackage: {
			type: SuperfoodProductDimensionsSchema,
			required: false,
		},
		storageConditions: { type: String, required: false },
		estimatedDeliveryDays: { type: Number, required: false },
		isCustomizableOrMixable: { type: Boolean, required: false },
	},
	{ _id: false },
);

const SuperfoodEpochSchema = new Schema(
	{
		title: { type: String, required: true },
		country: { type: String, required: true },
		city: { type: String, required: true },
		description: { type: String, required: true },
		processName: {
			type: String,
			enum: Object.values(TraceabilityProcessName),
			required: true,
		},
		supplier: { type: String, required: true },
	},
	{ _id: false },
);

const SuperfoodProductTraceabilitySchema = new Schema(
	{
		blockchainLink: { type: String, required: true },
		epochs: { type: [SuperfoodEpochSchema], required: true },
	},
	{ _id: false },
);

const SuperfoodDetailProductSchema = new Schema(
	{
		type: { type: String, required: false },
		productPresentation: { type: String, required: false },
		consumptionWay: {
			type: String,
			enum: Object.values(SuperfoodConsumptionWay),
			required: false,
		},
		consumptionSuggestions: { type: String },
		salesUnitSize: { type: String, required: false },
		medicRecommendations: { type: String },
		healthWarnings: { type: String },
		ingredients: { type: String, required: false },
		customerExpectations: { type: String, required: false },
	},
	{ _id: false },
);

// Main schema
export const SuperfoodProductSchema = new Schema({
	categoryId: { type: String, required: false },
	status: {
		type: String,
		enum: Object.values(SuperfoodProductStatus),
		required: true,
	},
	colorId: { type: String, required: false },
	detailSourceProductId: { type: String, required: false },
	baseInfo: { type: SuperfoodBasicInfoSchema, required: true },
	priceInventory: { type: SuperfoodPriceInventorySchema, required: true },
	detailProduct: { type: SuperfoodDetailProductSchema, required: false },
	nutritionalContent: {
		type: [SuperfoodNutritionalItemSchema],
		default: [],
		required: false,
	},
	detailTraceability: {
		type: SuperfoodDetailTraceabilitySchema,
		required: false,
	},
	productTraceability: {
		type: SuperfoodProductTraceabilitySchema,
		required: false,
	},
	options: { type: [SuperfoodOptionsSchema], default: [], required: false },
	isDiscountActive: { type: Boolean, default: false, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodProductDocument extends Document {
	categoryId?: string;
	status: SuperfoodProductStatus;
	colorId?: string;
	detailSourceProductId?: string;
	baseInfo: any;
	priceInventory: any;
	detailProduct?: any;
	nutritionalContent?: any[];
	detailTraceability?: any;
	productTraceability?: any;
	options?: any[];
	isDiscountActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

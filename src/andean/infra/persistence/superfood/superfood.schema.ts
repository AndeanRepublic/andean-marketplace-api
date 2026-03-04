import { Document, Schema } from 'mongoose';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';
import { SuperfoodColor } from '../../../domain/enums/SuperfoodColor';
import { SuperfoodConsumptionWay } from '../../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../../domain/enums/SuperfoodProductionMethod';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';
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

const SuperfoodBasicInfoSchema = new Schema(
	{
		title: { type: String, required: true },
		mediaIds: { type: [String], default: [] }, // IDs referencing MediaItem collection
		description: { type: String, required: true },
		general_features: { type: [String], default: [] },
		nutritional_features: { type: [String], default: [] }, // IDs
		benefits: { type: [String], default: [] }, // IDs
		ownerType: {
			type: String,
			enum: Object.values(SuperfoodOwnerType),
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
		SKU: { type: String, required: false },
	},
	{ _id: false },
);

const SuperfoodElaborationTimeSchema = new Schema(
	{
		days: { type: Number, required: false },
		hours: { type: Number, required: false },
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

const SuperfoodDetailTraceabilitySchema = new Schema(
	{
		handmade: { type: Boolean, required: false },
		secondaryMaterials: { type: [String], default: [] },
		originProductCommunityId: { type: String, required: false },
		productionMethod: {
			type: String,
			enum: Object.values(SuperfoodProductionMethod),
			required: false,
		},
		preservationMethod: { type: String, required: false }, // ID reference
		isArtesanal: { type: Boolean, required: false },
		isNatural: { type: Boolean, required: false },
		isEatableWithoutPrep: { type: Boolean, required: false },
		canCauseAllergies: { type: Boolean, required: false },
		certification: { type: String }, // ID reference
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
		type: { type: String, required: false }, // ID reference
		productPresentation: { type: String, required: false }, // ID reference
		consumptionWay: {
			type: String,
			enum: Object.values(SuperfoodConsumptionWay),
			required: false,
		},
		consumptionSuggestions: { type: String },
		salesUnitSize: { type: String, required: false }, // ID reference
		medicRecommendations: { type: String },
		healthWarnings: { type: String },
		elaborationTime: { type: SuperfoodElaborationTimeSchema, required: false },
		handmade: { type: Boolean, required: false },
		secondaryMaterials: { type: [String], default: [] },
		originProductCommunityId: { type: String, required: false },
		productionMethod: {
			type: String,
			enum: Object.values(SuperfoodProductionMethod),
			required: false,
		},
		preservationMethod: { type: String, required: false },
		isArtesanal: { type: Boolean, required: false },
		isNatural: { type: Boolean, required: false },
		isEatableWithoutPrep: { type: Boolean, required: false },
		canCauseAllergies: { type: Boolean, required: false },
		certification: { type: String },
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
	color: {
		type: String,
		enum: Object.values(SuperfoodColor),
		required: false,
	},
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
	color?: SuperfoodColor;
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

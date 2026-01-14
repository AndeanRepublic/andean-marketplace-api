import { Document, Schema } from 'mongoose';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';
import { SuperfoodConsumptionWay } from '../../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../../domain/enums/SuperfoodProductionMethod';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';

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

const SuperfoodVariantSchema = new Schema({
	id: { type: String, required: true },
	combination: { type: Schema.Types.Mixed, required: true },  // Object with optionId -> value
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
});

const SuperfoodBasicInfoSchema = new Schema({
	title: { type: String, required: true },
	mediaIds: { type: [String], default: [] },  // IDs referencing MediaItem collection
	description: { type: String, required: true },
	general_features: { type: [String], default: [] },
	nutritional_features: { type: [String], default: [] },  // IDs
	benefits: { type: [String], default: [] },  // IDs
	ownerType: { type: String, enum: Object.values(SuperfoodOwnerType), required: true },
	ownerId: { type: String, required: true },
}, { _id: false });

const SuperfoodPriceInventorySchema = new Schema({
	basePrice: { type: Number, required: true },
	totalStock: { type: Number, required: true },
	SKU: { type: String, required: true },
}, { _id: false });

const SuperfoodElaborationTimeSchema = new Schema({
	days: { type: Number, required: true },
	hours: { type: Number, required: true },
}, { _id: false });

const SuperfoodNutritionalItemSchema = new Schema({
	id: { type: String, required: true },
	quantity: { type: String, required: true },
	nutrient: { type: String, required: true },
	strikingFeature: { type: String, required: true },
	selected: { type: Boolean, default: false },
});

const SuperfoodDetailTraceabilitySchema = new Schema({
	handmade: { type: Boolean, required: true },
	secondaryMaterials: { type: [String], default: [] },
	originProductCommunityId: { type: String, required: true },
	productionMethod: {
		type: String,
		enum: Object.values(SuperfoodProductionMethod),
		required: true
	},
	preservationMethod: { type: String, required: true },  // ID reference
	isArtesanal: { type: Boolean, required: true },
	isNatural: { type: Boolean, required: true },
	isEatableWithoutPrep: { type: Boolean, required: true },
	canCauseAllergies: { type: Boolean, required: true },
	certification: { type: String },  // ID reference
}, { _id: false });

const SuperfoodDetailProductSchema = new Schema({
	type: { type: String, required: true },  // ID reference
	productPresentation: { type: String, required: true },  // ID reference
	consumptionWay: {
		type: String,
		enum: Object.values(SuperfoodConsumptionWay),
		required: true
	},
	consumptionSuggestions: { type: String },
	salesUnitSize: { type: String, required: true },  // ID reference
	medicRecommendations: { type: String },
	healthWarnings: { type: String },
	elaborationTime: { type: SuperfoodElaborationTimeSchema, required: true },
}, { _id: false });

// Main schema
export const SuperfoodProductSchema = new Schema({
	id: { type: String, required: true, unique: true },
	categoryId: { type: String, required: true },
	status: {
		type: String,
		enum: Object.values(SuperfoodProductStatus),
		required: true
	},
	baseInfo: { type: SuperfoodBasicInfoSchema, required: true },
	priceInventory: { type: SuperfoodPriceInventorySchema, required: true },
	detailProduct: { type: SuperfoodDetailProductSchema, required: true },
	nutritionalContent: { type: [SuperfoodNutritionalItemSchema], default: [] },
	detailTraceability: { type: SuperfoodDetailTraceabilitySchema, required: true },
	productTraceability: { type: Schema.Types.Mixed },  // General traceability (shared)
	options: { type: [SuperfoodOptionsSchema], default: [] },
	variants: { type: [SuperfoodVariantSchema], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodProductDocument extends Document {
	id: string;
	categoryId: string;
	status: SuperfoodProductStatus;
	baseInfo: any;
	priceInventory: any;
	detailProduct: any;
	nutritionalContent: any[];
	detailTraceability: any;
	productTraceability: any;
	options: any[];
	variants: any[];
	createdAt: Date;
	updatedAt: Date;
}

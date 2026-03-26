import { Document, Schema } from 'mongoose';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';
import { SizeGuide } from 'src/andean/domain/enums/SizeGuide';
import { ToolUsed } from 'src/andean/domain/enums/ToolUsed';
import { ProductCurrency } from 'src/andean/domain/enums/ProductCurrency';
import { ShippingMethod } from 'src/andean/domain/enums/ShippingMethod';
import { ShippingRegion } from 'src/andean/domain/enums/ShippingRegion';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
import { TraceabilityProcessName } from 'src/andean/domain/enums/TraceabilityProcessName';

// Nested schemas

const BaseInfoSchema = new Schema(
	{
		title: { type: String, required: true },
		mediaIds: { type: [String], required: true },
		description: { type: String, required: true },
		ownerType: {
			type: String,
			enum: Object.values(OwnerType),
			required: true,
		},
		ownerId: { type: String, required: true },
		information: { type: String, required: false },
	},
	{ _id: false },
);

const PriceInventarySchema = new Schema(
	{
		basePrice: { type: Number, required: true },
		totalStock: { type: Number, required: true },
		currency: {
			type: String,
			enum: Object.values(ProductCurrency),
			required: true,
		},
		SKU: { type: String, required: false },
	},
	{ _id: false },
);

const AtributeSchema = new Schema({
	textileTypeId: { type: String, required: false },
	gender: {
		type: String,
		enum: Object.values(Gender),
		required: false,
	},
	textileStyleId: { type: String, required: false },
	season: {
		type: String,
		enum: Object.values(Season),
		required: false,
	},
	principalUse: { type: [String], required: false },
	preparationTime: {
		days: { type: Number, required: false },
		hours: { type: Number, required: false },
	},
	inspiration: { type: String, required: false },
	sizeGuide: {
		type: String,
		enum: Object.values(SizeGuide),
		required: false,
	},
	careInstructions: { type: String, required: false },
});

const TextileOptionsItemSchema = new Schema(
	{
		label: { type: String, required: true },
		mediaIds: { type: [String], default: [] },
		idOpcionAlternative: { type: String, required: false },
	},
	{ _id: false },
);

const TextileOptionsSchema = new Schema(
	{
		name: {
			type: String,
			enum: Object.values(TextileOptionName),
			required: true,
		},
		values: { type: [TextileOptionsItemSchema], default: [] },
	},
	{ _id: false },
);

const ProductDimensionsSchema = new Schema(
	{
		length: { type: Number, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
	},
	{ _id: false },
);

const DetailTraceabilitySchema = new Schema(
	{
		isHandmade: { type: Boolean, required: false },
		secondaryMaterial: { type: [String], default: [] },
		originProductCommunityId: { type: String, required: false },
		craftTechniqueId: { type: String, required: false },
		toolUsed: {
			type: String,
			enum: Object.values(ToolUsed),
			required: false,
		},
		isArtisanExclusive: { type: Boolean, required: false },
		isOriginalCreation: { type: Boolean, required: false },
		isRegisteredDesign: { type: Boolean, required: false },
		availableUponRequest: { type: Boolean, required: false },
		leadTime: { type: Number, required: false },
		certificationIds: { type: [String], default: [] },
		principalMaterial: { type: [String], default: [] },
		materialOrigin: { type: String, required: false },
		customizable: { type: String, required: false },
		hasCertifications: { type: Boolean, required: false },
		weightWithoutPackage: { type: Number, required: false },
		dimensionsWithoutPackage: {
			type: ProductDimensionsSchema,
			required: false,
		},
		packagingType: { type: String, required: false },
		packageCustomization: { type: [String], default: [] },
		weightWithPackage: { type: Number, required: false },
		dimensionsWithPackage: { type: ProductDimensionsSchema, required: false },
		shippingMethods: [
			{
				type: String,
				enum: Object.values(ShippingMethod),
			},
		],
		shippingRegions: [
			{
				type: String,
				enum: Object.values(ShippingRegion),
			},
		],
		estimatedDeliveryDays: { type: Number, required: false },
	},
	{ _id: false },
);

const TextileTraceabilityEpochSchema = new Schema(
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

const ProductTraceabilitySchema = new Schema(
	{
		blockchainLink: { type: String, required: true },
		epochs: { type: [TextileTraceabilityEpochSchema], default: [] },
	},
	{ _id: false },
);

export const TextileProductSchema = new Schema({
	categoryId: { type: String, required: true },
	status: {
		type: String,
		enum: Object.values(TextileProductStatus),
		required: true,
	},
	baseInfo: { type: BaseInfoSchema, required: true },
	priceInventary: { type: PriceInventarySchema, required: true },
	atribute: { type: AtributeSchema, required: false },
	detailTraceability: { type: DetailTraceabilitySchema, required: false },
	productTraceability: { type: ProductTraceabilitySchema, required: false },
	options: { type: [TextileOptionsSchema], default: [], required: false },
	isDiscountActive: { type: Boolean, default: false, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface TextileProductDocument extends Document {
	categoryId: string;
	status: TextileProductStatus;
	baseInfo: {
		title: string;
		mediaIds: string[];
		description: string;
		ownerType: OwnerType;
		ownerId: string;
		information?: string;
	};
	priceInventary: {
		basePrice: number;
		totalStock: number;
		currency: string;
		SKU?: string;
	};
	atribute?: {
		textileTypeId?: string;
		gender?: Gender;
		textileStyleId?: string;
		season?: Season;
		principalUse?: string[];
		preparationTime?: {
			days?: number;
			hours?: number;
		};
		inspiration?: string;
		sizeGuide?: SizeGuide;
		careInstructions?: string;
	};
	detailTraceability?: {
		isHandmade?: boolean;
		secondaryMaterial?: string[];
		originProductCommunityId?: string;
		craftTechniqueId?: string;
		toolUsed?: ToolUsed;
		isArtisanExclusive?: boolean;
		isOriginalCreation?: boolean;
		isRegisteredDesign?: boolean;
		availableUponRequest?: boolean;
		leadTime?: number;
		certificationIds?: string[];
		principalMaterial?: string[];
		materialOrigin?: string;
		customizable?: string;
		hasCertifications?: boolean;
		weightWithoutPackage?: number;
		dimensionsWithoutPackage?: {
			length: number;
			width: number;
			height: number;
		};
		packagingType?: string;
		packageCustomization?: string[];
		weightWithPackage?: number;
		dimensionsWithPackage?: { length: number; width: number; height: number };
		shippingMethods?: ShippingMethod[];
		shippingRegions?: ShippingRegion[];
		estimatedDeliveryDays?: number;
	};
	productTraceability?: any;
	options?: any[];
	isDiscountActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

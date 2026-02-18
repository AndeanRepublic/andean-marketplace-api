import { Document, Schema } from 'mongoose';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';
import { ToolUsed } from 'src/andean/domain/enums/ToolUsed';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';

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
		isBackorderAvailable: { type: Boolean, required: false },
		leadTime: { type: Number, required: false },
		certificationId: { type: String, required: false },
	},
	{ _id: false },
);

const TextileTraceabilityEpochSchema = new Schema(
	{
		title: { type: String, required: true },
		country: { type: String, required: true },
		city: { type: String, required: true },
		description: { type: String, required: true },
		processName: { type: String, required: true },
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
	categoryId: { type: String, required: false },
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
	categoryId?: string;
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
		isBackorderAvailable?: boolean;
		leadTime?: number;
		certificationId?: string;
	};
	productTraceability?: any;
	options?: any[];
	isDiscountActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

const BoxProductSchema = new Schema(
	{
		productType: {
			type: String,
			enum: Object.values(BoxProductType),
			required: true,
		},
		variantId: { type: String },
		boxPrice: { type: Number },
		narrativeImgId: { type: String },
	},
	{ _id: false },
);

export const BoxSchema = new Schema({
	name: { type: String, required: true },
	slogan: { type: String, required: true },
	narrative: { type: String, required: true },
	thumbnailImageId: { type: String, required: true },
	mainImageId: { type: String, required: true },
	products: { type: [BoxProductSchema], required: true },
	status: {
		type: String,
		enum: Object.values(AdminEntityStatus),
		default: AdminEntityStatus.HIDDEN,
	},
	price: { type: Number, required: true },
	discountPercentage: { type: Number, required: false },
	sealIds: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

BoxSchema.index({ createdAt: -1 });

export interface BoxDocument extends Document {
	name: string;
	slogan: string;
	narrative: string;
	thumbnailImageId: string;
	mainImageId: string;
	products: {
		productType?: string;
		variantId?: string;
		boxPrice?: number;
		narrativeImgId?: string;
	}[];
	status: AdminEntityStatus;
	price: number;
	discountPercentage?: number;
	sealIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';
import { BoxProductType } from '../../../domain/enums/BoxProductType';

const BoxProductSchema = new Schema(
	{
		productType: {
			type: String,
			enum: Object.values(BoxProductType),
			required: true,
		},
		productId: { type: String },
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
		productId?: string;
		variantId?: string;
		boxPrice?: number;
		narrativeImgId?: string;
	}[];
	price: number;
	discountPercentage?: number;
	sealIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

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
	},
	{ _id: false },
);

export const BoxSchema = new Schema({
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	description: { type: String, required: true },
	thumbnailImageId: { type: String, required: true },
	mainImageId: { type: String, required: true },
	products: { type: [BoxProductSchema], required: true },
	price: { type: Number, required: true },
	sealIds: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

BoxSchema.index({ createdAt: -1 });

export interface BoxDocument extends Document {
	title: string;
	subtitle: string;
	description: string;
	thumbnailImageId: string;
	mainImageId: string;
	products: { productType?: string; productId?: string; variantId?: string }[];
	price: number;
	sealIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

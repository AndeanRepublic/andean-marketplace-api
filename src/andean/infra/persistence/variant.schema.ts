import { Document, Schema } from 'mongoose';
import { ProductType } from '../../domain/enums/ProductType';

export const VariantSchema = new Schema({
	productId: { type: String, required: true, index: true },
	productType: {
		type: String,
		enum: Object.values(ProductType),
		required: true,
	},
	combination: { type: Schema.Types.Mixed, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Index for faster queries by productId
VariantSchema.index({ productId: 1 });

export interface VariantDocument extends Document {
	productId: string;
	productType: ProductType;
	combination: Record<string, string>;
	price: number;
	stock: number;
	createdAt: Date;
	updatedAt: Date;
}

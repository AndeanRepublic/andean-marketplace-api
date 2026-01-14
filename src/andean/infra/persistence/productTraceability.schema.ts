import { Document, Schema } from 'mongoose';
import { ProductType } from '../../domain/enums/ProductType';

const TraceabilityEpochSchema = new Schema({
	title: { type: String, required: true },
	country: { type: String, required: true },
	city: { type: String, required: true },
	description: { type: String, required: true },
	processName: { type: String, required: true },
	supplier: { type: String, required: true },
}, { _id: false });

export const ProductTraceabilitySchema = new Schema({
	id: { type: String, required: true, unique: true },
	productId: { type: String, required: true },
	productType: {
		type: String,
		enum: Object.values(ProductType),
		required: true
	},
	blockchainLink: { type: String, required: true },
	epochs: { type: [TraceabilityEpochSchema], default: [] },
});

// Índice compuesto para búsquedas eficientes
ProductTraceabilitySchema.index({ productId: 1, productType: 1 });

export interface ProductTraceabilityDocument extends Document {
	id: string;
	productId: string;
	productType: ProductType;
	blockchainLink: string;
	epochs: {
		title: string;
		country: string;
		city: string;
		description: string;
		processName: string;
		supplier: string;
	}[];
}

import { Document, Schema } from 'mongoose';

const TraceabilityEpochSchema = new Schema(
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

export const ProductTraceabilitySchema = new Schema({
	id: { type: String, required: true, unique: true },
	blockchainLink: { type: String, required: true },
	epochs: { type: [TraceabilityEpochSchema], default: [] },
});

export interface ProductTraceabilityDocument extends Document {
	id: string;
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

import { Document, Schema } from 'mongoose';
import { TraceabilityProcessName } from '../../domain/enums/TraceabilityProcessName';

const TraceabilityEpochSchema = new Schema(
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

export const ProductTraceabilitySchema = new Schema({
	id: { type: String, required: true, unique: true },
	blockchainActive: { type: Boolean, default: false, required: true },
	hasTraceabilityEpochs: { type: Boolean, default: false, required: true },
	epochs: { type: [TraceabilityEpochSchema], default: [] },
});

export interface ProductTraceabilityDocument extends Document {
	id: string;
	blockchainActive: boolean;
	hasTraceabilityEpochs: boolean;
	epochs: {
		title: string;
		country: string;
		city: string;
		description: string;
		processName: TraceabilityProcessName;
		supplier: string;
	}[];
}

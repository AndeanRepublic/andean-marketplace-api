import { Document, Schema } from 'mongoose';

export const FounderInfoSchema = new Schema({
	founderName: { type: String, required: true },
	founderImage: { type: String, required: true },
});

export interface FounderInfoDocument extends Document {
	founderName: string;
	founderImage: string;
}

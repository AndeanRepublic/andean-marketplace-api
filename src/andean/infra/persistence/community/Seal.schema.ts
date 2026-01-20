import { Document, Schema } from 'mongoose';

export const SealSchema = new Schema({
	name: String,
	description: String,
	logoUrl: String,
});

export interface SealDocument extends Document {
	name: string;
	description: string;
	logoUrl: string;
}

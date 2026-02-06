import { Document, Schema } from 'mongoose';

export const SealSchema = new Schema({
	name: String,
	description: String,
	logoMediaId: String,
});

export interface SealDocument extends Document {
	name: string;
	description: string;
	logoMediaId: string;
}

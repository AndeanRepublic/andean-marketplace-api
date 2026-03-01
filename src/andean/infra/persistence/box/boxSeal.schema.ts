import { Document, Schema } from 'mongoose';

export const BoxSealSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	logoMediaId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

BoxSealSchema.index({ name: 1 });

export interface BoxSealDocument extends Document {
	name: string;
	description: string;
	logoMediaId: string;
	createdAt: Date;
	updatedAt: Date;
}

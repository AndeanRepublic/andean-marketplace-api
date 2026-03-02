import { Document, Schema } from 'mongoose';

export const DetailSourceProductSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	features: { type: [String], required: true, default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface DetailSourceProductDocument extends Document {
	name: string;
	description: string;
	features: string[];
	createdAt: Date;
	updatedAt: Date;
}

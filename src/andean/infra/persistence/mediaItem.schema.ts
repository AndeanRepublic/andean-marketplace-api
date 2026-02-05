import { Document, Schema } from 'mongoose';

export const MediaItemSchema = new Schema({
	type: { type: String, required: true }, // e.g., "image", "video"
	name: { type: String, required: true },
	url: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface MediaItemDocument extends Document {
	type: string;
	name: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
}

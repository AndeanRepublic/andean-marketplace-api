import { Document, Schema } from 'mongoose';

export const MediaItemSchema = new Schema({
	type: { type: String, required: true }, // e.g., "image", "video"
	name: { type: String, required: true },
	key: { type: String, required: true }, // Path dentro del bucket
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface MediaItemDocument extends Document {
	type: string;
	name: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}

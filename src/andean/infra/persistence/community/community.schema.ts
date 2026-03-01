import { Document, Schema } from 'mongoose';

export const CommunitySchema = new Schema({
	name: { type: String, required: true },
	bannerImageId: { type: String, required: true },
	seals: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CommunityDocument extends Document {
	name: string;
	bannerImageId: string;
	seals?: string[];
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';

export const CommunitySchema = new Schema({
	name: { type: String, required: true },
	bannerImageId: { type: String, required: true },
	seals: { type: [String], default: [] },
	providerInfoId: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CommunityDocument extends Document {
	name: string;
	bannerImageId: string;
	seals?: string[];
	providerInfoId?: string;
	createdAt: Date;
	updatedAt: Date;
}

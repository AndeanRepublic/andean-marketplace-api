import { Document, Schema } from 'mongoose';

export const OriginProductCommunitySchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	regionId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface OriginProductCommunityDocument extends Document {
	id: string;
	name: string;
	regionId: string;
	createdAt: Date;
	updatedAt: Date;
}

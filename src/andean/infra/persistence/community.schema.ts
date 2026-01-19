import { Document, Schema } from 'mongoose';

export const CommunitySchema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CommunityDocument extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

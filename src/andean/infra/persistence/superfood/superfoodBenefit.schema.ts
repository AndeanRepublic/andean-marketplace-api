import { Document, Schema } from 'mongoose';

export const SuperfoodBenefitSchema = new Schema({
	name: { type: String, required: true },
	iconId: { type: String }, // Reference to MediaItem
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodBenefitDocument extends Document {
	name: string;
	iconId?: string;
	createdAt: Date;
	updatedAt: Date;
}

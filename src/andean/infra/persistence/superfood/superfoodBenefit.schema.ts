import { Document, Schema } from 'mongoose';

export const SuperfoodBenefitSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	hexCodeColor: { type: String, required: true },
	iconId: { type: String, required: true }, // Reference to MediaItem
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodBenefitDocument extends Document {
	name: string;
	description: string;
	hexCodeColor: string;
	iconId: string;
	createdAt: Date;
	updatedAt: Date;
}

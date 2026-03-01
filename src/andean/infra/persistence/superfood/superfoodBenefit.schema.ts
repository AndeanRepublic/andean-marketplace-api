import { Document, Schema } from 'mongoose';
import { SuperfoodColor } from '../../../domain/enums/SuperfoodColor';

export const SuperfoodBenefitSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	color: {
		type: String,
		enum: Object.values(SuperfoodColor),
		required: false,
	},
	iconId: { type: String }, // Reference to MediaItem
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodBenefitDocument extends Document {
	name: string;
	description: string;
	color?: SuperfoodColor;
	iconId?: string;
	createdAt: Date;
	updatedAt: Date;
}

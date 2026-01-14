import { Document, Schema } from 'mongoose';

export const SuperfoodBenefitSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	icon: { type: String },  // URL to icon
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodBenefitDocument extends Document {
	id: string;
	name: string;
	icon?: string;
	createdAt: Date;
	updatedAt: Date;
}

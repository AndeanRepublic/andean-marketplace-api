import { Document, Schema } from 'mongoose';

export const SuperfoodCategorySchema = new Schema({
	name: { type: String, required: true },
	status: { type: String, enum: ['ENABLED', 'DISABLED'], default: 'ENABLED' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodCategoryDocument extends Document {
	name: string;
	status: 'ENABLED' | 'DISABLED';
	createdAt: Date;
	updatedAt: Date;
}

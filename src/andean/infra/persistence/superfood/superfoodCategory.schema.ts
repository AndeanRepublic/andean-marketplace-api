import { Document, Schema } from 'mongoose';

export const SuperfoodCategorySchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	status: { type: String, enum: ['ENABLED', 'DISABLED'], default: 'ENABLED' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodCategoryDocument extends Document {
	id: string;
	name: string;
	status: 'ENABLED' | 'DISABLED';
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';

export const SuperfoodTypeSchema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodTypeDocument extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

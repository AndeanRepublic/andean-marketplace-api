import { Document, Schema } from 'mongoose';

export const SuperfoodColorCatalogSchema = new Schema({
	name: { type: String, required: true },
	hexCodeColor: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodColorCatalogDocument extends Document {
	name: string;
	hexCodeColor: string;
	createdAt: Date;
	updatedAt: Date;
}

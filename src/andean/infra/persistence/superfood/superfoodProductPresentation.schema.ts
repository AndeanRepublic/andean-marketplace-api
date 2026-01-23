import { Document, Schema } from 'mongoose';

export const SuperfoodProductPresentationSchema = new Schema({
	name: { type: String, required: true }, // e.g., "Bolsa", "Frasco", "Caja"
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodProductPresentationDocument extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

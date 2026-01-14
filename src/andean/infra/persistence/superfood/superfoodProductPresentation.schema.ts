import { Document, Schema } from 'mongoose';

export const SuperfoodProductPresentationSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },  // e.g., "Bolsa", "Frasco", "Caja"
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodProductPresentationDocument extends Document {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

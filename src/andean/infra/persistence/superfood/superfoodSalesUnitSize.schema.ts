import { Document, Schema } from 'mongoose';

export const SuperfoodSalesUnitSizeSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },  // e.g., "100g", "500g", "1kg"
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodSalesUnitSizeDocument extends Document {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

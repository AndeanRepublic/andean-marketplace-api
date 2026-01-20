import { Document, Schema } from 'mongoose';

export const SuperfoodSalesUnitSizeSchema = new Schema({
	name: { type: String, required: true },  // e.g., "100g", "500g", "1kg"
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodSalesUnitSizeDocument extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

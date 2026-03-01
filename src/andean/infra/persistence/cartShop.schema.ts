import { Document, Schema } from 'mongoose';

export const CartShopSchema = new Schema({
	customerId: { type: String, required: false },
	customerEmail: { type: String, required: false },
	deliveryCost: Number,
	discount: Number,
	taxOrFee: Number,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CartShopDocument extends Document {
	customerId?: string;
	customerEmail?: string;
	deliveryCost: number;
	discount: number;
	taxOrFee: number;
	createdAt: Date;
	updatedAt: Date;
}

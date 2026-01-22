import { Document, Schema } from 'mongoose';

export const CartShopSchema = new Schema({
  customerId: String,
	deliveryCost: Number,
	discount: Number,
	taxOrFee: Number,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CartShopDocument extends Document {
  customerId: string;
	deliveryCost: number;
	discount: number;
	taxOrFee: number;
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';

export const OrderItemSchema = new Schema({
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  variantProductId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface OrderItemDocument extends Document {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  variantProductId?: string;
  createdAt: Date;
  updatedAt: Date;
}

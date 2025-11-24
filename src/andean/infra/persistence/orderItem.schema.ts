import { Schema } from 'mongoose';

export const OrderItemSchema = new Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  variantProductId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export interface OrderItemDocument extends Document {
  _id: string;
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  variantProductId: string;
  quantity: number;
  price: number;
}

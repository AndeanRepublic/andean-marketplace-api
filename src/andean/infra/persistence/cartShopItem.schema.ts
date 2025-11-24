import { Schema } from 'mongoose';

export const CartItemSchema = new Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  productId: { type: String, required: true },
  variantProductId: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

export interface CartShopItemDocument extends Document {
  _id: string;
  id: string;
  userId: string;
  cartId: string;
  productId: string;
  variantProductId: string;
  quantity: number;
  unitPrice: number;
}

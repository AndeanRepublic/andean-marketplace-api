import { Schema } from 'mongoose';
import { CartItem } from '../../domain/entities/CartItem';

export const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const CartShopSchema = new Schema({
  _id: String,
  id: String,
  customerId: String,
  items: {
    type: [CartItem],
    default: [],
  },
  totalAmount: Number,
});

export interface CartShopDocument extends Document {
  _id: string;
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
}

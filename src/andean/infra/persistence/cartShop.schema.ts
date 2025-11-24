import { Schema } from 'mongoose';

export const CartShopSchema = new Schema({
  _id: String,
  id: String,
  customerId: String,
});

export interface CartShopDocument extends Document {
  _id: string;
  id: string;
  userId: string;
}

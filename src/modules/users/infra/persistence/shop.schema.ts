import { Schema } from 'mongoose';
import { ShopCategory } from '../../domain/enums/ShopCategory';

export const ShopSchema = new Schema({
  _id: String,
  id: String,
  sellerId: String,
  name: String,
  description: String,
  categories: [
    {
      type: String,
      enum: Object.values(ShopCategory),
    },
  ],
  policies: String,
  shippingOrigin: String,
  shippingArea: String,
});

export interface ShopDocument extends Document {
  _id: string;
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  categories: ShopCategory[];
  policies?: string;
  shippingOrigin: string;
  shippingArea: string;
}

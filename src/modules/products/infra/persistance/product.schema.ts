import { Document, Schema } from 'mongoose';
import { ProductStatus } from '../../domain/enums/ProductStatus';

export const ProductSchema = new Schema({
  _id: String,
  id: String,
  shopId: String,
  sellerId: String,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    required: true,
  },
});

export interface ProductDocument extends Document {
  _id: string;
  id: string;
  shopId: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}

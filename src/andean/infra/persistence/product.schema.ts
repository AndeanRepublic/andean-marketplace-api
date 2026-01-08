import { Document, Schema, Types } from 'mongoose';
import { ProductStatus } from '../../domain/enums/ProductStatus';
import { TimeModel } from '../../domain/entities/products/TimeModel';

export const ProductSchema = new Schema({
  _id: String,
  id: { type: String, required: true },
  shopId: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true },
  origin: { type: String, required: true },
  photos: { type: [String], default: [] },
  attributes: { type: Schema.Types.Mixed, default: {} },
  stock: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    required: true,
  },
  shippingTime: {
    from: Number,
    to: Number,
    unit: String,
  },
  timeGuarantee: {
    from: Number,
    to: Number,
    unit: String,
  },
});

export interface ProductDocument extends Document<string> {
  _id: string;
  id: string;
  shopId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  origin: string;
  photos: string[];
  attributes: any;
  stock: number;
  status: ProductStatus;
  shippingTime: TimeModel;
  timeGuarantee: TimeModel;
}

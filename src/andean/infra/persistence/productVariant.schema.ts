import { Schema } from 'mongoose';
import { ProductStatus } from '../../domain/enums/ProductStatus';
import { TimeModel } from '../../domain/entities/products/TimeModel';

export const ProductVariantSchema = new Schema({
  _id: String,
  id: { type: String, required: true },
  productId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  attributes: { type: Schema.Types.Mixed, default: {} },
  stock: { type: Number, required: true },
  photos: { type: [String], default: [] },
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

export interface ProductVariantDocument extends Document {
  _id: string;
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  attributes: any;
  stock: number;
  photos: string[];
  status: ProductStatus;
  shippingTime: TimeModel;
  timeGuarantee: TimeModel;
}

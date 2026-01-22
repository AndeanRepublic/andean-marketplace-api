import { Document, Schema } from 'mongoose';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../domain/enums/PaymentMethod';

export const OrderSchema = new Schema({
  customerId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  deliveryCost: { type: Number, required: true },
  discount: { type: Number, required: true },
  taxOrFee: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface OrderDocument extends Document {
  customerId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryCost: number;
  discount: number;
  taxOrFee: number;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

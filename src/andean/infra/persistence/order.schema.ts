import { Schema } from 'mongoose';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../domain/enums/PaymentMethod';

export const OrderSchema = new Schema({
  _id: String,
  id: String,
  userId: String,
  totalAmount: Number,
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
  },
});

export interface OrderDocument extends Document {
  _id: string;
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
}

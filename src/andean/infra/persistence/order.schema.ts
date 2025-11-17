import { Schema } from 'mongoose';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../domain/enums/PaymentMethod';
import { OrderItem } from '../../domain/entities/OrderItem';

export const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  sellerId: { type: String, required: true },
});

export const OrderSchema = new Schema({
  _id: String,
  id: String,
  customerId: String,
  items: {
    type: [OrderItemSchema],
    default: [],
  },
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
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
}

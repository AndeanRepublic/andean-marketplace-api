import { OrderItem } from './OrderItem';
import { OrderStatus } from '../enums/OrderStatus';
import { PaymentMethod } from '../enums/PaymentMethod';

export class Order {
  constructor(
    public id: string,
    public customerId: string,
    public items: OrderItem[],
    public totalAmount: number,
    public status: OrderStatus,
    public paymentMethod: PaymentMethod,
  ) {}
}

import { OrderStatus } from '../enums/OrderStatus';
import { PaymentMethod } from '../enums/PaymentMethod';

export class Order {
  constructor(
    public id: string,
    public userId: string,
    public totalAmount: number,
    public status: OrderStatus,
    public paymentMethod: PaymentMethod,
  ) {}
}

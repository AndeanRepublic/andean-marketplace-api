import { OrderStatus } from '../enums/OrderStatus';
import { PaymentMethod } from '../enums/PaymentMethod';

export class Order {
  constructor(
    public id: string,
		public customerId: string,
    public totalAmount: number,
    public status: OrderStatus,
		public deliveryCost: number,
		public discount: number,
		public taxOrFee: number,
		public createdAt: Date,
		public updatedAt: Date,
		
		public paymentMethod?: PaymentMethod,
  ) {}
}

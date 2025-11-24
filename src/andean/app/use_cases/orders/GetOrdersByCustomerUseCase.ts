import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/Order.repo';
import { Order } from '../../../domain/entities/Order';

@Injectable()
export class GetOrdersByCustomerUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private userRepository: CustomerProfileRepository,
    @Inject(OrderRepository)
    private orderRepository: OrderRepository,
  ) {}

  async handle(customerId: string): Promise<Order[]> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    return this.orderRepository.getOrdersByCustomerId(customerId);
  }
}

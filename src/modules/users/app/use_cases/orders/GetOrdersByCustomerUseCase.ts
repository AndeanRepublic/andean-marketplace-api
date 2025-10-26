import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/Order.repo';
import { Order } from '../../../domain/entities/Order';

@Injectable()
export class GetOrdersByCustomerUseCase {
  constructor(
    @Inject(UserRepository)
    private userRepository: UserRepository,
    @Inject(OrderRepository)
    private orderRepository: OrderRepository,
  ) {}

  async handle(customerId: string): Promise<Order[]> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    return this.orderRepository.getOrdersByCustomerId(customerId);
  }
}

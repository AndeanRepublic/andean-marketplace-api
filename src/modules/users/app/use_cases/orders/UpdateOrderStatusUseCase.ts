import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/Order.repo';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Injectable(OrderRepository)
    private orderRepository: OrderRepository,
  ) {}

  async handle(orderId: string, status: OrderStatus): Promise<void> {
    const orderFound = await this.orderRepository.getOrderById(orderId);
    if (!orderFound) {
      throw new NotFoundException('Order not found');
    }
    return this.orderRepository.updateOrderStatus(orderId, status);
  }
}

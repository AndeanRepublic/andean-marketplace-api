import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/Order.repo';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async handle(orderId: string, newStatus: string): Promise<void> {
    const orderFound = await this.orderRepository.getOrderById(orderId);
    if (!orderFound) {
      throw new NotFoundException('Order not found');
    }
    const status: OrderStatus =
      OrderStatus[newStatus as keyof typeof OrderStatus];
    return this.orderRepository.updateOrderStatus(orderId, status);
  }
}

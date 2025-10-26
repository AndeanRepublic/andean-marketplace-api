import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/Order.repo';
import { CreateOrderDto } from '../../../infra/controllers/dto/CreateOrderDto';
import { Order } from '../../../domain/entities/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
  ) {}

  async handle(orderDto: CreateOrderDto): Promise<Order> {
    const customerFound = await this.userRepository.getCustomerById(
      orderDto.customerId,
    );
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    const orderToSave = new Order(
      crypto.randomUUID(),
      orderDto.customerId,
      orderDto.items,
      orderDto.totalAmount,
      OrderStatus.PAID,
      orderDto.paymentMethod,
    );
    return this.orderRepository.createOrder(orderToSave);
  }
}

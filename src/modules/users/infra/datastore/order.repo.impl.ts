import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../app/datastore/Order.repo';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../persistence/order.schema';
import { Order } from '../../domain/entities/Order';
import { Model } from 'mongoose';
import { OrderStatus } from '../../domain/enums/OrderStatus';

@Injectable()
export class OrderRepositoryImpl extends OrderRepository {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<OrderDocument>,
  ) {
    super();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderModel.find({ customerId }).exec();
  }

  async createOrder(order: Order): Promise<Order> {
    const created = new this.orderModel({
      _id: crypto.randomUUID(),
      id: order.id,
      customerId: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
    });
    return await created.save();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    return this.orderModel.findByIdAndUpdate(id, status).exec();
  }
}

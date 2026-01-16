import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { CreateOrderUseCase } from '../../app/use_cases/orders/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../app/use_cases/orders/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from '../../app/use_cases/orders/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from '../../app/use_cases/orders/UpdateOrderStatusUseCase';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { Order } from '../../domain/entities/Order';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Controller('orders')
export class OrderController {
	constructor(
		private readonly createOrderUseCase: CreateOrderUseCase,
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase,
		private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
	) { }

	@Post('')
	async createOrder(@Body() body: CreateOrderDto): Promise<Order> {
		return this.createOrderUseCase.handle(body);
	}

	@Get('/:id')
	async getById(@Param('id') id: string): Promise<Order | null> {
		return this.getOrderByIdUseCase.handle(id);
	}

	@Get('/by-customer/:customerId')
	async getByCustomerId(
		@Param('customerId') customerId: string,
	): Promise<Order[]> {
		return this.getOrdersByCustomerUseCase.handle(customerId);
	}

	@Put('/:id')
	async updateById(
		@Param('id') id: string,
		@Body() body: UpdateOrderDto,
	): Promise<Order> {
		return this.updateOrderStatusUseCase.handle(id, body);
	}
}

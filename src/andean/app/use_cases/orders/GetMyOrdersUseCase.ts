import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { PaginatedOrdersResponse } from '../../models/order/PaginatedOrdersResponse';
import { UserOrderFilterStrategy } from '../../../infra/services/order/UserOrderFilterStrategy';

@Injectable()
export class GetMyOrdersUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly orderItemEnricher: OrderItemEnricher,
		private readonly userOrderFilterStrategy: UserOrderFilterStrategy,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
		user: any,
	): Promise<PaginatedOrdersResponse> {
		const filter = await this.userOrderFilterStrategy.buildFilter(user);

		const { orders, total } = await this.orderRepository.getPaginatedOrders(
			filter,
			page,
			perPage,
		);

		const enrichedOrders = await this.orderItemEnricher.enrichOrders(orders);

		const totalPages = Math.ceil(total / perPage);

		return {
			data: enrichedOrders as any,
			pagination: {
				total,
				page,
				per_page: perPage,
				total_pages: totalPages,
			},
		};
	}
}

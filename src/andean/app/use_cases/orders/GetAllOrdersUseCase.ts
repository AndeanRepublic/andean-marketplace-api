import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { PaginatedOrdersResponse } from '../../models/order/PaginatedOrdersResponse';
import { OrderFilterStrategy } from '../../../infra/services/order/OrderFilterStrategy';
import { AdminOrderFilterStrategy } from '../../../infra/services/order/AdminOrderFilterStrategy';
import { SellerOrderFilterStrategy } from '../../../infra/services/order/SellerOrderFilterStrategy';
import { AccountRole } from '../../../domain/enums/AccountRole';

@Injectable()
export class GetAllOrdersUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly orderItemEnricher: OrderItemEnricher,
		private readonly adminOrderFilterStrategy: AdminOrderFilterStrategy,
		private readonly sellerOrderFilterStrategy: SellerOrderFilterStrategy,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
		user?: any,
	): Promise<PaginatedOrdersResponse> {
		// Resolver estrategia basada en rol del usuario
		const strategy = this.resolveStrategy(user);

		// Construir filtro usando la estrategia
		const filter = await strategy.buildFilter(user);

		// Obtener órdenes paginadas
		const { orders, total } = await this.orderRepository.getPaginatedOrders(
			filter,
			page,
			perPage,
		);

		// Enriquecer órdenes con información de productos
		const enrichedOrders = await this.orderItemEnricher.enrichOrders(orders);

		// Construir metadata de paginación
		const totalPages = Math.ceil(total / perPage);

		return {
			data: enrichedOrders as any, // NestJS maneja la conversión a OrderResponse[]
			pagination: {
				total,
				page,
				per_page: perPage,
				total_pages: totalPages,
			},
		};
	}

	/**
	 * Resuelve la estrategia de filtrado basada en el rol del usuario.
	 * ADMIN: ve todas las órdenes.
	 * SELLER: ve solo órdenes con productos de su propiedad.
	 * Por defecto (sin user): se asume ADMIN (retrocompatibilidad).
	 *
	 * Nota: el rol USER tiene su propio use case (GetMyOrdersUseCase).
	 */
	private resolveStrategy(user?: any): OrderFilterStrategy {
		if (!user) {
			return this.adminOrderFilterStrategy;
		}

		// user.roles es un array de AccountRole[]
		const roles = user.roles || [];

		if (roles.includes(AccountRole.SELLER)) {
			return this.sellerOrderFilterStrategy;
		}

		// ADMIN o cualquier otro rol con acceso: ve todas las órdenes
		return this.adminOrderFilterStrategy;
	}
}

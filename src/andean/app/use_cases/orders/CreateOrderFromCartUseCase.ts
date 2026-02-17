import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { Order } from '../../../domain/entities/order/Order';
import { CreateOrderFromCartDto } from '../../../infra/controllers/dto/order/CreateOrderFromCartDto';
import { ReduceStockFromOrderUseCase } from './ReduceStockFromOrderUseCase';

@Injectable()
export class CreateOrderFromCartUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		private readonly reduceStockUseCase: ReduceStockFromOrderUseCase,
	) { }

	async handle(
		customerId: string | undefined,
		customerEmail: string | undefined,
		dto: CreateOrderFromCartDto,
	): Promise<Order> {
		// 1. Validar que al menos uno de los identificadores esté presente
		if (!customerId && !customerEmail) {
			throw new BadRequestException('Either customerId or customerEmail must be provided');
		}

		// 2. Obtener el carrito del cliente
		const cart = await this.cartShopRepository.getCartByIdentifier(customerId, customerEmail);
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		// 3. Obtener items del carrito
		const cartItems = await this.cartItemRepository.getItemsByCartShopId(
			cart.id,
		);

		if (!cartItems || cartItems.length === 0) {
			throw new BadRequestException('Cart is empty');
		}

		// 4. Validar que customerId o customerEmail esté presente
		if (!cart.customerId && !cart.customerEmail) {
			throw new BadRequestException(
				'Either customerId or customerEmail must be present',
			);
		}

		// 5. Validar y reducir stock antes de crear la orden
		await this.reduceStockUseCase.handle(cartItems);

		// 6. Crear orden desde el carrito
		const order = await this.orderRepository.createOrderFromCart(
			cart,
			cartItems,
			dto.shippingInfo,
			dto.payment,
			dto.currency,
		);

		// 7. Limpiar el carrito después de crear la orden exitosamente
		await this.cartItemRepository.deleteItemsByCartShopId(cart.id);

		return order;
	}
}

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GetOrderByIdUseCase } from './GetOrderByIdUseCase';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductType } from '../../../domain/enums/ProductType';

describe('GetOrderByIdUseCase', () => {
	let useCase: GetOrderByIdUseCase;
	let orderRepository: jest.Mocked<OrderRepository>;
	let orderItemEnricher: jest.Mocked<OrderItemEnricher>;

	beforeEach(async () => {
		const mockOrderRepository = {
			getOrderById: jest.fn(),
		};

		const mockOrderItemEnricher = {
			enrichOrders: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetOrderByIdUseCase,
				{
					provide: OrderRepository,
					useValue: mockOrderRepository,
				},
				{
					provide: OrderItemEnricher,
					useValue: mockOrderItemEnricher,
				},
			],
		}).compile();

		useCase = module.get<GetOrderByIdUseCase>(GetOrderByIdUseCase);
		orderRepository = module.get(OrderRepository);
		orderItemEnricher = module.get(OrderItemEnricher);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('handle', () => {
		it('should throw BadRequestException for invalid order ID', async () => {
			await expect(useCase.handle('invalid-id')).rejects.toThrow(
				BadRequestException,
			);
			await expect(useCase.handle('invalid-id')).rejects.toThrow(
				'Invalid order ID',
			);
		});

		it('should throw NotFoundException when order not found', async () => {
			orderRepository.getOrderById.mockResolvedValue(null);

			await expect(
				useCase.handle('507f1f77bcf86cd799439011'),
			).rejects.toThrow(NotFoundException);
			await expect(
				useCase.handle('507f1f77bcf86cd799439011'),
			).rejects.toThrow('Order not found');
		});

		it('should return order and call enricher', async () => {
			const mockOrder = createMockOrder();
			const enrichedOrder = {
				...mockOrder,
				items: mockOrder.items.map((item) => ({
					...item,
					imageUrl: 'https://storage.example.com/image.jpg',
				})),
			};

			orderRepository.getOrderById.mockResolvedValue(mockOrder);
			orderItemEnricher.enrichOrders.mockResolvedValue([enrichedOrder]);

			const result = await useCase.handle('507f1f77bcf86cd799439011');

			expect(orderRepository.getOrderById).toHaveBeenCalledWith(
				'507f1f77bcf86cd799439011',
			);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith([
				mockOrder,
			]);
			expect(result).toEqual(enrichedOrder);
			expect(result.items[0].imageUrl).toBe(
				'https://storage.example.com/image.jpg',
			);
		});
	});
});

function createMockOrder(): Order {
	const items: OrderItem[] = [
		{
			productId: 'product-123',
			productType: ProductType.TEXTILE,
			name: 'Poncho Andino',
			quantity: 1,
			unitPrice: 50,
			discount: 0,
			totalPrice: 50,
		},
	];

	return new Order(
		'order-123',
		'customer-123',
		'customer@example.com',
		OrderStatus.PROCESSING,
		items,
		{
			subtotal: 50,
			discount: 0,
			deliveryCost: 10,
			taxOrFee: 5,
			totalAmount: 65,
			currency: 'USD',
		},
		{
			recipientName: 'John Doe',
			phone: '+1234567890',
			countryCode: 'US',
			country: 'United States',
			administrativeArea: {},
			addressLine1: '123 Main St',
		},
		{
			method: PaymentMethod.PAYPAL,
		},
		DeliveryOption.DHL,
		new Date(),
		new Date(),
	);
}

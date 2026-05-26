import { Test, TestingModule } from '@nestjs/testing';
import { GetMyOrdersUseCase } from './GetMyOrdersUseCase';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { UserOrderFilterStrategy } from '../../../infra/services/order/UserOrderFilterStrategy';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductType } from '../../../domain/enums/ProductType';

describe('GetMyOrdersUseCase', () => {
	let useCase: GetMyOrdersUseCase;
	let orderRepository: jest.Mocked<OrderRepository>;
	let orderItemEnricher: jest.Mocked<OrderItemEnricher>;
	let userOrderFilterStrategy: jest.Mocked<UserOrderFilterStrategy>;

	const mockUser = { userId: 'user-123', roles: ['USER'] };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetMyOrdersUseCase,
				{
					provide: OrderRepository,
					useValue: {
						getPaginatedOrders: jest.fn(),
					},
				},
				{
					provide: OrderItemEnricher,
					useValue: {
						enrichOrders: jest.fn(),
					},
				},
				{
					provide: UserOrderFilterStrategy,
					useValue: {
						buildFilter: jest
							.fn()
							.mockResolvedValue({ customerId: 'user-123' }),
					},
				},
			],
		}).compile();

		useCase = module.get<GetMyOrdersUseCase>(GetMyOrdersUseCase);
		orderRepository = module.get(OrderRepository);
		orderItemEnricher = module.get(OrderItemEnricher);
		userOrderFilterStrategy = module.get(UserOrderFilterStrategy);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('handle', () => {
		it('should filter orders by customerId using UserOrderFilterStrategy', async () => {
			const mockOrders = [
				createMockOrder('order-1', 'user-123'),
				createMockOrder('order-2', 'user-123'),
			];
			const enrichedOrders = mockOrders.map((o) => ({ ...o }));

			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: mockOrders,
				total: 2,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue(enrichedOrders);

			const result = await useCase.handle(1, 10, mockUser);

			expect(userOrderFilterStrategy.buildFilter).toHaveBeenCalledWith(
				mockUser,
			);
			expect(orderRepository.getPaginatedOrders).toHaveBeenCalledWith(
				{ customerId: 'user-123' },
				1,
				10,
			);
			expect(result.data).toEqual(enrichedOrders);
			expect(result.pagination.total).toBe(2);
			expect(result.pagination.page).toBe(1);
			expect(result.pagination.per_page).toBe(10);
			expect(result.pagination.total_pages).toBe(1);
		});

		it('should return correct pagination metadata', async () => {
			const mockOrders = Array.from({ length: 10 }, (_, i) =>
				createMockOrder(`order-${i}`, 'user-123'),
			);

			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: mockOrders,
				total: 25,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue(mockOrders);

			const result = await useCase.handle(2, 10, mockUser);

			expect(result.pagination.total).toBe(25);
			expect(result.pagination.page).toBe(2);
			expect(result.pagination.per_page).toBe(10);
			expect(result.pagination.total_pages).toBe(3);
		});

		it('should return empty result when user has no orders', async () => {
			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: [],
				total: 0,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue([]);

			const result = await useCase.handle(1, 10, mockUser);

			expect(result.data).toEqual([]);
			expect(result.pagination.total).toBe(0);
			expect(result.pagination.total_pages).toBe(0);
		});

		it('should only use UserOrderFilterStrategy — never admin or seller logic', async () => {
			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: [],
				total: 0,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue([]);

			await useCase.handle(1, 10, mockUser);

			expect(userOrderFilterStrategy.buildFilter).toHaveBeenCalledTimes(1);
			// No admin/seller strategy is even injected — this test guarantees isolation
		});
	});
});

function createMockOrder(orderId: string, customerId: string): Order {
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
		orderId,
		customerId,
		`${customerId}@example.com`,
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

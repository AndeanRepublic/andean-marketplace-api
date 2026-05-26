import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrdersUseCase } from './GetAllOrdersUseCase';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductType } from '../../../domain/enums/ProductType';
import { AdminOrderFilterStrategy } from '../../../infra/services/order/AdminOrderFilterStrategy';
import { SellerOrderFilterStrategy } from '../../../infra/services/order/SellerOrderFilterStrategy';

describe('GetAllOrdersUseCase', () => {
	let useCase: GetAllOrdersUseCase;
	let orderRepository: jest.Mocked<OrderRepository>;
	let orderItemEnricher: jest.Mocked<OrderItemEnricher>;
	let adminOrderFilterStrategy: AdminOrderFilterStrategy;
	let sellerOrderFilterStrategy: SellerOrderFilterStrategy;

	beforeEach(async () => {
		const mockOrderRepository = {
			getAllOrders: jest.fn(),
			getPaginatedOrders: jest.fn(),
		};

		const mockOrderItemEnricher = {
			enrichOrders: jest.fn(),
		};

		const mockAdminOrderFilterStrategy = {
			buildFilter: jest.fn().mockResolvedValue({}),
		};

		const mockSellerOrderFilterStrategy = {
			buildFilter: jest
				.fn()
				.mockResolvedValue({ 'items.productId': { $in: ['product-1'] } }),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetAllOrdersUseCase,
				{
					provide: OrderRepository,
					useValue: mockOrderRepository,
				},
				{
					provide: OrderItemEnricher,
					useValue: mockOrderItemEnricher,
				},
				{
					provide: AdminOrderFilterStrategy,
					useValue: mockAdminOrderFilterStrategy,
				},
				{
					provide: SellerOrderFilterStrategy,
					useValue: mockSellerOrderFilterStrategy,
				},
			],
		}).compile();

		useCase = module.get<GetAllOrdersUseCase>(GetAllOrdersUseCase);
		orderRepository = module.get(OrderRepository);
		orderItemEnricher = module.get(OrderItemEnricher);
		adminOrderFilterStrategy = module.get(AdminOrderFilterStrategy);
		sellerOrderFilterStrategy = module.get(SellerOrderFilterStrategy);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('handle', () => {
		it('should return all orders enriched with images', async () => {
			const mockOrders = [
				createMockOrder('order-1', 'customer-1'),
				createMockOrder('order-2', 'customer-2'),
				createMockOrder('order-3', 'customer-1'),
			];

			const enrichedOrders = mockOrders.map((order) => ({
				...order,
				items: order.items.map((item) => ({
					...item,
					imageUrl: 'https://storage.example.com/image.jpg',
				})),
			}));

			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: mockOrders,
				total: 3,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue(enrichedOrders);

			const result = await useCase.handle(1, 10);

			expect(orderRepository.getPaginatedOrders).toHaveBeenCalledTimes(1);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith(mockOrders);
			expect(result.data).toEqual(enrichedOrders);
			expect(result.data).toHaveLength(3);
		});

		it('should handle batch resolution across multiple orders', async () => {
			const mockOrders = [
				createMockOrder('order-1', 'customer-1'),
				createMockOrder('order-2', 'customer-2'),
				createMockOrder('order-3', 'customer-3'),
				createMockOrder('order-4', 'customer-4'),
				createMockOrder('order-5', 'customer-5'),
			];

			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: mockOrders,
				total: 5,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue(mockOrders);

			await useCase.handle(1, 10);

			// Verify enricher is called once with all orders for batch processing
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledTimes(1);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith(mockOrders);
		});

		it('should return empty array when no orders exist', async () => {
			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: [],
				total: 0,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue([]);

			const result = await useCase.handle(1, 10);

			expect(result.data).toEqual([]);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith([]);
		});

		it('should enrich orders with mixed product types', async () => {
			const mockOrder = createMockOrderWithMixedProducts();
			const enrichedOrder = {
				...mockOrder,
				items: mockOrder.items.map((item, index) => ({
					...item,
					// Only textile items get imageUrl
					imageUrl:
						item.productType === ProductType.TEXTILE
							? 'https://storage.example.com/textile.jpg'
							: undefined,
				})),
			};

			orderRepository.getPaginatedOrders.mockResolvedValue({
				orders: [mockOrder],
				total: 1,
			});
			orderItemEnricher.enrichOrders.mockResolvedValue([enrichedOrder]);

			const result = await useCase.handle(1, 10);

			expect(result.data[0].items[0].imageUrl).toBe(
				'https://storage.example.com/textile.jpg',
			);
			expect(result.data[0].items[1].imageUrl).toBeUndefined(); // SUPERFOOD
			expect(result.data[0].items[2].imageUrl).toBeUndefined(); // BOX
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

function createMockOrderWithMixedProducts(): Order {
	const items: OrderItem[] = [
		{
			productId: 'textile-1',
			productType: ProductType.TEXTILE,
			name: 'Poncho',
			quantity: 1,
			unitPrice: 50,
			discount: 0,
			totalPrice: 50,
		},
		{
			productId: 'superfood-1',
			productType: ProductType.SUPERFOOD,
			name: 'Quinoa',
			quantity: 2,
			unitPrice: 10,
			discount: 0,
			totalPrice: 20,
		},
		{
			productId: 'box-1',
			productType: ProductType.BOX,
			name: 'Starter Box',
			quantity: 1,
			unitPrice: 30,
			discount: 0,
			totalPrice: 30,
		},
	];

	return new Order(
		'order-mixed',
		'customer-123',
		'customer@example.com',
		OrderStatus.PROCESSING,
		items,
		{
			subtotal: 100,
			discount: 0,
			deliveryCost: 15,
			taxOrFee: 10,
			totalAmount: 125,
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

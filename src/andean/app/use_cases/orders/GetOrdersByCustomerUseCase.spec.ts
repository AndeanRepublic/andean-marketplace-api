import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetOrdersByCustomerUseCase } from './GetOrdersByCustomerUseCase';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductType } from '../../../domain/enums/ProductType';

describe('GetOrdersByCustomerUseCase', () => {
	let useCase: GetOrdersByCustomerUseCase;
	let orderRepository: jest.Mocked<OrderRepository>;
	let customerRepository: jest.Mocked<CustomerProfileRepository>;
	let orderItemEnricher: jest.Mocked<OrderItemEnricher>;

	beforeEach(async () => {
		const mockOrderRepository = {
			getOrdersByCustomerId: jest.fn(),
		};

		const mockCustomerRepository = {
			getCustomerById: jest.fn(),
		};

		const mockOrderItemEnricher = {
			enrichOrders: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetOrdersByCustomerUseCase,
				{
					provide: OrderRepository,
					useValue: mockOrderRepository,
				},
				{
					provide: CustomerProfileRepository,
					useValue: mockCustomerRepository,
				},
				{
					provide: OrderItemEnricher,
					useValue: mockOrderItemEnricher,
				},
			],
		}).compile();

		useCase = module.get<GetOrdersByCustomerUseCase>(
			GetOrdersByCustomerUseCase,
		);
		orderRepository = module.get(OrderRepository);
		customerRepository = module.get(CustomerProfileRepository);
		orderItemEnricher = module.get(OrderItemEnricher);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('handle', () => {
		it('should throw BadRequestException for invalid customer ID', async () => {
			await expect(useCase.handle('invalid-id')).rejects.toThrow(
				BadRequestException,
			);
			await expect(useCase.handle('invalid-id')).rejects.toThrow(
				'Invalid customer ID',
			);
		});

		it('should throw NotFoundException when customer not found', async () => {
			customerRepository.getCustomerById.mockResolvedValue(null);

			await expect(
				useCase.handle('507f1f77bcf86cd799439011'),
			).rejects.toThrow(NotFoundException);
			await expect(
				useCase.handle('507f1f77bcf86cd799439011'),
			).rejects.toThrow('Customer not found');
		});

		it('should return enriched orders for valid customer', async () => {
			const mockCustomer = { id: 'customer-123', email: 'test@example.com' };
			const mockOrders = [createMockOrder('order-1'), createMockOrder('order-2')];
			const enrichedOrders = mockOrders.map((order) => ({
				...order,
				items: order.items.map((item) => ({
					...item,
					imageUrl: 'https://storage.example.com/image.jpg',
				})),
			}));

			customerRepository.getCustomerById.mockResolvedValue(
				mockCustomer as any,
			);
			orderRepository.getOrdersByCustomerId.mockResolvedValue(mockOrders);
			orderItemEnricher.enrichOrders.mockResolvedValue(enrichedOrders);

			const result = await useCase.handle('507f1f77bcf86cd799439011');

			expect(customerRepository.getCustomerById).toHaveBeenCalledWith(
				'507f1f77bcf86cd799439011',
			);
			expect(orderRepository.getOrdersByCustomerId).toHaveBeenCalledWith(
				'507f1f77bcf86cd799439011',
			);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith(
				mockOrders,
			);
			expect(result).toEqual(enrichedOrders);
			expect(result).toHaveLength(2);
			expect(result[0].items[0].imageUrl).toBe(
				'https://storage.example.com/image.jpg',
			);
		});

		it('should handle multiple orders with batch enrichment', async () => {
			const mockCustomer = { id: 'customer-123', email: 'test@example.com' };
			const mockOrders = [
				createMockOrder('order-1'),
				createMockOrder('order-2'),
				createMockOrder('order-3'),
			];

			customerRepository.getCustomerById.mockResolvedValue(
				mockCustomer as any,
			);
			orderRepository.getOrdersByCustomerId.mockResolvedValue(mockOrders);
			orderItemEnricher.enrichOrders.mockResolvedValue(mockOrders);

			await useCase.handle('507f1f77bcf86cd799439011');

			// Verify enricher is called once with all orders
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledTimes(1);
			expect(orderItemEnricher.enrichOrders).toHaveBeenCalledWith(
				mockOrders,
			);
		});
	});
});

function createMockOrder(orderId: string): Order {
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

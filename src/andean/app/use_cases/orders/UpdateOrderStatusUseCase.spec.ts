import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateOrderStatusUseCase } from './UpdateOrderStatusUseCase';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { SendOrderDeliveredUseCase } from '../email/SendOrderDeliveredUseCase';
import { Order, OrderItem } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { ProductType } from '../../../domain/enums/ProductType';

describe('UpdateOrderStatusUseCase', () => {
	let useCase: UpdateOrderStatusUseCase;
	let orderRepository: jest.Mocked<OrderRepository>;
	let sendOrderDeliveredUseCase: jest.Mocked<SendOrderDeliveredUseCase>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateOrderStatusUseCase,
				{
					provide: OrderRepository,
					useValue: {
						getOrderById: jest.fn(),
						changeOrderStatus: jest.fn(),
					},
				},
				{
					provide: SendOrderDeliveredUseCase,
					useValue: {
						send: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		useCase = module.get(UpdateOrderStatusUseCase);
		orderRepository = module.get(OrderRepository);
		sendOrderDeliveredUseCase = module.get(SendOrderDeliveredUseCase);
	});

	it('rejects statuses outside the admin workflow', async () => {
		orderRepository.getOrderById.mockResolvedValue(createMockOrder());

		await expect(
			useCase.handle('507f1f77bcf86cd799439011', {
				status: OrderStatus.SHIPPED,
			}),
		).rejects.toThrow(BadRequestException);
		expect(orderRepository.changeOrderStatus).not.toHaveBeenCalled();
	});

	it('updates to DELIVERED and sends delivered email once', async () => {
		const existingOrder = createMockOrder(OrderStatus.PROCESSING);
		const deliveredOrder = createMockOrder(OrderStatus.DELIVERED);
		orderRepository.getOrderById.mockResolvedValue(existingOrder);
		orderRepository.changeOrderStatus.mockResolvedValue(deliveredOrder);

		const result = await useCase.handle('507f1f77bcf86cd799439011', {
			status: OrderStatus.DELIVERED,
		});

		expect(result.status).toBe(OrderStatus.DELIVERED);
		expect(orderRepository.changeOrderStatus).toHaveBeenCalledWith(
			'507f1f77bcf86cd799439011',
			OrderStatus.DELIVERED,
		);
		expect(sendOrderDeliveredUseCase.send).toHaveBeenCalledWith(deliveredOrder);
	});

	it('does not resend delivered email when order was already delivered', async () => {
		const deliveredOrder = createMockOrder(OrderStatus.DELIVERED);
		orderRepository.getOrderById.mockResolvedValue(deliveredOrder);
		orderRepository.changeOrderStatus.mockResolvedValue(deliveredOrder);

		await useCase.handle('507f1f77bcf86cd799439011', {
			status: OrderStatus.DELIVERED,
		});

		expect(sendOrderDeliveredUseCase.send).not.toHaveBeenCalled();
	});

	it('throws NotFoundException when order is missing', async () => {
		orderRepository.getOrderById.mockResolvedValue(null);

		await expect(
			useCase.handle('507f1f77bcf86cd799439011', {
				status: OrderStatus.PROCESSING,
			}),
		).rejects.toThrow(NotFoundException);
	});
});

function createMockOrder(status = OrderStatus.PROCESSING): Order {
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
		'507f1f77bcf86cd799439011',
		'customer-123',
		'customer@example.com',
		status,
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

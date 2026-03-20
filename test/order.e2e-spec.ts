import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { FixtureLoader } from './helpers/fixture-loader';

// ─── Controller ─────────────────────────────────────────────────────────────
import { OrderController } from '../src/andean/infra/controllers/order.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import { createAllowAllGuard, mockAuthUsers } from './helpers/auth-test.helper';

// ─── Use Cases ──────────────────────────────────────────────────────────────
import { CreateOrderUseCase } from '../src/andean/app/use_cases/orders/CreateOrderUseCase';
import { CreateOrderFromCartUseCase } from '../src/andean/app/use_cases/orders/CreateOrderFromCartUseCase';
import { GetOrderByIdUseCase } from '../src/andean/app/use_cases/orders/GetOrderByIdUseCase';
import { GetAllOrdersUseCase } from '../src/andean/app/use_cases/orders/GetAllOrdersUseCase';
import { GetOrdersByCustomerUseCase } from '../src/andean/app/use_cases/orders/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from '../src/andean/app/use_cases/orders/UpdateOrderStatusUseCase';
import { CreatePayPalOrderUseCase } from '../src/andean/app/use_cases/payments/CreatePayPalOrderUseCase';
import { CapturePayPalOrderUseCase } from '../src/andean/app/use_cases/payments/CapturePayPalOrderUseCase';

// ─── Domain ─────────────────────────────────────────────────────────────────
import { Order } from '../src/andean/domain/entities/order/Order';

describe('OrderController (e2e)', () => {
	let app: INestApplication;
	let createOrderUseCase: CreateOrderUseCase;
	let createOrderFromCartUseCase: CreateOrderFromCartUseCase;
	let getOrderByIdUseCase: GetOrderByIdUseCase;
	let getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase;
	let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
	let getAllOrdersUseCase: GetAllOrdersUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadOrder();
	const mockOrder = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as Order;
	const createDto = fixture.createDto;
	const createFromCartDto = fixture.createFromCartDto;
	const updateDto = fixture.updateDto;
	const orderList = fixture.orderList.map((o: any) => ({
		...o,
		createdAt: new Date(o.createdAt),
		updatedAt: new Date(o.updatedAt),
	})) as Order[];
	const updatedOrder = {
		...fixture.updatedEntity,
		createdAt: new Date(fixture.updatedEntity.createdAt),
		updatedAt: new Date(fixture.updatedEntity.updatedAt),
	} as Order;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [OrderController],
			providers: [
				{
					provide: CreateOrderUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockOrder) },
				},
				{
					provide: CreateOrderFromCartUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockOrder) },
				},
				{
					provide: GetOrderByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockOrder) },
				},
				{
					provide: GetOrdersByCustomerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(orderList) },
				},
				{
					provide: UpdateOrderStatusUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(updatedOrder) },
				},
				{
					provide: CreatePayPalOrderUseCase,
					useValue: {
						handle: jest
							.fn()
							.mockResolvedValue({ orderId: 'PAYPAL-ORDER-123' }),
					},
				},
				{
					provide: CapturePayPalOrderUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							success: true,
							orderId: 'PAYPAL-ORDER-123',
							status: 'COMPLETED',
							transactionId: '8F148899LY528414L',
						}),
					},
				},
				{
					provide: GetAllOrdersUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([]) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(mockAuthUsers.admin))
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => true })
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();

		createOrderUseCase = moduleFixture.get(CreateOrderUseCase);
		createOrderFromCartUseCase = moduleFixture.get(CreateOrderFromCartUseCase);
		getOrderByIdUseCase = moduleFixture.get(GetOrderByIdUseCase);
		getOrdersByCustomerUseCase = moduleFixture.get(GetOrdersByCustomerUseCase);
		updateOrderStatusUseCase = moduleFixture.get(UpdateOrderStatusUseCase);
		getAllOrdersUseCase = moduleFixture.get(GetAllOrdersUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /orders  —  Create a new Order
	// ⚠️ SKIPPED: Endpoints commented out in OrderController
	// ═══════════════════════════════════════════════════════════════════════════
	describe.skip('POST /orders (SKIPPED - endpoint commented out)', () => {
		it('should create a new order', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						customerId: mockOrder.customerId,
						status: mockOrder.status,
					});
					expect(res.body.items).toHaveLength(2);
					expect(res.body).toHaveProperty('pricing');
					expect(res.body).toHaveProperty('shippingInfo');
					expect(res.body).toHaveProperty('payment');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should call the use case with the correct DTO', async () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			await request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED);
			expect(createOrderUseCase.handle).toHaveBeenCalledWith(
				expect.objectContaining({
					customerId: createDto.customerId,
					customerEmail: createDto.customerEmail,
				}),
			);
		});

		it('should return correct item shape', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					const item = res.body.items[0];
					expect(item).toHaveProperty('productId');
					expect(item).toHaveProperty('productType');
					expect(item).toHaveProperty('name');
					expect(item).toHaveProperty('quantity');
					expect(item).toHaveProperty('unitPrice');
					expect(item).toHaveProperty('totalPrice');
				});
		});

		it('should return correct pricing shape', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					const pricing = res.body.pricing;
					expect(pricing).toHaveProperty('subtotal');
					expect(pricing).toHaveProperty('discount');
					expect(pricing).toHaveProperty('deliveryCost');
					expect(pricing).toHaveProperty('taxOrFee');
					expect(pricing).toHaveProperty('totalAmount');
					expect(pricing).toHaveProperty('currency');
				});
		});

		it('should return correct shippingInfo shape', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					const shipping = res.body.shippingInfo;
					expect(shipping).toHaveProperty('recipientName');
					expect(shipping).toHaveProperty('phone');
					expect(shipping).toHaveProperty('countryCode');
					expect(shipping).toHaveProperty('country');
					expect(shipping).toHaveProperty('city');
					expect(shipping).toHaveProperty('administrativeArea');
					expect(shipping).toHaveProperty('addressLine1');
				});
		});

		it('should return correct payment shape', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					const payment = res.body.payment;
					expect(payment).toHaveProperty('method');
				});
		});

		it('should return 400 when items is empty array', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.send({ ...createDto, items: [] })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when items is not provided', () => {
			const { items, ...dtoWithoutItems } = createDto;
			return request(app.getHttpServer())
				.post('/orders')
				.send(dtoWithoutItems)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when pricing is missing', () => {
			const { pricing, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/orders')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when shippingInfo is missing', () => {
			const { shippingInfo, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/orders')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when payment is missing', () => {
			const { payment, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/orders')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when item has invalid productType', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.send({
					...createDto,
					items: [{ ...createDto.items[0], productType: 'INVALID' }],
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when item quantity is less than 1', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.send({
					...createDto,
					items: [{ ...createDto.items[0], quantity: 0 }],
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when payment method is invalid', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.send({
					...createDto,
					payment: { ...createDto.payment, method: 'INVALID' },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should accept order without customerId (guest checkout with email)', () => {
			jest.spyOn(createOrderUseCase, 'handle').mockResolvedValueOnce(mockOrder);
			const { customerId, ...guestDto } = createDto;
			return request(app.getHttpServer())
				.post('/orders')
				.send({ ...guestDto, customerEmail: 'guest@example.com' })
				.expect(HttpStatus.CREATED);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /orders/from-cart  —  Create order from cart
	// ⚠️ SKIPPED: Endpoints commented out in OrderController
	// ═══════════════════════════════════════════════════════════════════════════
	describe.skip('POST /orders/from-cart (SKIPPED - endpoint commented out)', () => {
		it('should create an order from cart with customerId query', () => {
			jest
				.spyOn(createOrderFromCartUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(createFromCartDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						status: mockOrder.status,
					});
					expect(res.body).toHaveProperty('items');
					expect(res.body).toHaveProperty('pricing');
					expect(res.body).toHaveProperty('shippingInfo');
					expect(res.body).toHaveProperty('payment');
				});
		});

		it('should call the use case with correct parameters', async () => {
			jest
				.spyOn(createOrderFromCartUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			await request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(createFromCartDto)
				.expect(HttpStatus.CREATED);
			expect(createOrderFromCartUseCase.handle).toHaveBeenCalledWith(
				'customer-uuid-789',
				expect.objectContaining({
					currency: createFromCartDto.currency,
				}),
			);
		});

		it('should return 400 when customerId is missing', async () => {
			jest
				.spyOn(createOrderFromCartUseCase, 'handle')
				.mockImplementationOnce((customerId: string | undefined) => {
					if (!customerId) {
						return Promise.reject(
							new (require('@nestjs/common').BadRequestException)(
								'customerId must be provided',
							),
						);
					}
					return Promise.resolve(mockOrder);
				});
			await request(app.getHttpServer())
				.post('/orders/from-cart')
				.send(createFromCartDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when shippingInfo is missing from cart order', () => {
			const { shippingInfo, ...dtoWithout } = createFromCartDto;
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when payment is missing from cart order', () => {
			const { payment, ...dtoWithout } = createFromCartDto;
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when currency is missing from cart order', () => {
			const { currency, ...dtoWithout } = createFromCartDto;
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 404 when cart is not found', () => {
			jest
				.spyOn(createOrderFromCartUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').NotFoundException)('Cart not found'),
				);
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=non-existent')
				.send(createFromCartDto)
				.expect(HttpStatus.NOT_FOUND);
		});

		it('should return 400 when cart is empty', () => {
			jest
				.spyOn(createOrderFromCartUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').BadRequestException)('Cart is empty'),
				);
			return request(app.getHttpServer())
				.post('/orders/from-cart?customerId=customer-uuid-789')
				.send(createFromCartDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /orders/:id  —  Get order by ID
	// ═══════════════════════════════════════════════════════════════════════════
	describe('GET /orders/:id', () => {
		const orderId = mockOrder.id;

		it('should return an order by id', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: orderId,
						customerId: mockOrder.customerId,
						status: mockOrder.status,
					});
					expect(res.body).toHaveProperty('items');
					expect(res.body).toHaveProperty('pricing');
					expect(res.body).toHaveProperty('shippingInfo');
					expect(res.body).toHaveProperty('payment');
				});
		});

		it('should call the use case with the correct id', async () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			await request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK);
			expect(getOrderByIdUseCase.handle).toHaveBeenCalledWith(orderId);
		});

		it('should return correct item details', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body.items).toHaveLength(2);
					const textile = res.body.items[0];
					expect(textile.productType).toBe('TEXTILE');
					expect(textile.name).toBe('Poncho Andino Premium');
					expect(textile.quantity).toBe(2);
					expect(textile.unitPrice).toBe(150.0);
					expect(textile.totalPrice).toBe(300.0);

					const superfood = res.body.items[1];
					expect(superfood.productType).toBe('SUPERFOOD');
					expect(superfood.name).toBe('Quinua Premium');
				});
		});

		it('should return correct pricing values', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const pricing = res.body.pricing;
					expect(pricing.subtotal).toBe(325.5);
					expect(pricing.deliveryCost).toBe(15.0);
					expect(pricing.totalAmount).toBe(350.5);
					expect(pricing.currency).toBe('USD');
				});
		});

		it('should return correct shipping info values', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const shipping = res.body.shippingInfo;
					expect(shipping.recipientName).toBe('Juan Pérez');
					expect(shipping.countryCode).toBe('PE');
					expect(shipping.city).toBe('Lima');
					expect(shipping.administrativeArea.level1).toBe('Lima');
				});
		});

		it('should return correct payment info', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockOrder);
			return request(app.getHttpServer())
				.get(`/orders/${orderId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const payment = res.body.payment;
					expect(payment.method).toBe('PAYPAL');
					expect(payment.provider).toBe('PAYPAL');
					expect(payment.transactionId).toBe('TXN123456789');
				});
		});

		it('should return 404 when order is not found', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').NotFoundException)('Order not found'),
				);
			return request(app.getHttpServer())
				.get('/orders/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});

		it('should return 400 when order id is invalid', () => {
			jest
				.spyOn(getOrderByIdUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').BadRequestException)(
						'Invalid order ID',
					),
				);
			return request(app.getHttpServer())
				.get('/orders/invalid-id')
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /orders/by-customer/:customerId  —  Get orders by customer
	// ═══════════════════════════════════════════════════════════════════════════
	describe('GET /orders/by-customer/:customerId', () => {
		const customerId = 'customer-uuid-789';

		it('should return orders for a customer', () => {
			jest
				.spyOn(getOrdersByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(orderList);
			return request(app.getHttpServer())
				.get(`/orders/by-customer/${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id');
					expect(res.body[0]).toHaveProperty('customerId', customerId);
					expect(res.body[0]).toHaveProperty('status');
					expect(res.body[0]).toHaveProperty('items');
					expect(res.body[0]).toHaveProperty('pricing');
				});
		});

		it('should call the use case with the correct customerId', async () => {
			jest
				.spyOn(getOrdersByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(orderList);
			await request(app.getHttpServer())
				.get(`/orders/by-customer/${customerId}`)
				.expect(HttpStatus.OK);
			expect(getOrdersByCustomerUseCase.handle).toHaveBeenCalledWith(
				customerId,
			);
		});

		it('should return empty array when customer has no orders', () => {
			jest
				.spyOn(getOrdersByCustomerUseCase, 'handle')
				.mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get(`/orders/by-customer/${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});

		it('should return 404 when customer is not found', () => {
			jest
				.spyOn(getOrdersByCustomerUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').NotFoundException)(
						'Customer not found',
					),
				);
			return request(app.getHttpServer())
				.get('/orders/by-customer/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});

		it('should return 400 when customerId is invalid', () => {
			jest
				.spyOn(getOrdersByCustomerUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').BadRequestException)(
						'Invalid customer ID',
					),
				);
			return request(app.getHttpServer())
				.get('/orders/by-customer/invalid-id')
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// PUT /orders/:id/status  —  Update order status
	// ═══════════════════════════════════════════════════════════════════════════
	describe('PUT /orders/:id/status', () => {
		const orderId = mockOrder.id;

		it('should update order status', () => {
			jest
				.spyOn(updateOrderStatusUseCase, 'handle')
				.mockResolvedValueOnce(updatedOrder);
			return request(app.getHttpServer())
				.put(`/orders/${orderId}/status`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: orderId,
						status: 'SHIPPED',
					});
				});
		});

		it('should call the use case with correct parameters', async () => {
			jest
				.spyOn(updateOrderStatusUseCase, 'handle')
				.mockResolvedValueOnce(updatedOrder);
			await request(app.getHttpServer())
				.put(`/orders/${orderId}/status`)
				.send(updateDto)
				.expect(HttpStatus.OK);
			expect(updateOrderStatusUseCase.handle).toHaveBeenCalledWith(
				orderId,
				expect.objectContaining({ status: updateDto.status }),
			);
		});

		it('should accept all valid order statuses', async () => {
			const validStatuses = [
				'PROCESSING',
				'SHIPPED',
				'CANCELLED',
				'DELAYED',
				'DELIVERED',
				'RETURNED',
				'REFUNDED',
			];
			for (const status of validStatuses) {
				jest.spyOn(updateOrderStatusUseCase, 'handle').mockResolvedValueOnce({
					...updatedOrder,
					status,
				} as any);
				await request(app.getHttpServer())
					.put(`/orders/${orderId}/status`)
					.send({ status })
					.expect(HttpStatus.OK);
			}
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.put(`/orders/${orderId}/status`)
				.send({ status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is missing', () => {
			return request(app.getHttpServer())
				.put(`/orders/${orderId}/status`)
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 404 when order is not found', () => {
			jest
				.spyOn(updateOrderStatusUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').NotFoundException)('Order not found'),
				);
			return request(app.getHttpServer())
				.put('/orders/non-existent-id/status')
				.send(updateDto)
				.expect(HttpStatus.NOT_FOUND);
		});

		it('should return 400 when order id is invalid', () => {
			jest
				.spyOn(updateOrderStatusUseCase, 'handle')
				.mockRejectedValueOnce(
					new (require('@nestjs/common').BadRequestException)(
						'Invalid order ID',
					),
				);
			return request(app.getHttpServer())
				.put('/orders/invalid-id/status')
				.send(updateDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return updated order with new status and updatedAt', () => {
			jest
				.spyOn(updateOrderStatusUseCase, 'handle')
				.mockResolvedValueOnce(updatedOrder);
			return request(app.getHttpServer())
				.put(`/orders/${orderId}/status`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body.status).toBe('SHIPPED');
					expect(res.body).toHaveProperty('updatedAt');
					// Items and other data should remain unchanged
					expect(res.body.items).toHaveLength(2);
					expect(res.body.pricing.totalAmount).toBe(350.5);
				});
		});
	});
});

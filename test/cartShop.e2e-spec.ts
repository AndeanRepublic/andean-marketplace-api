import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CartShopController } from '../src/andean/infra/controllers/cartShop.controller';
import { AddItemToCartUseCase } from '../src/andean/app/use_cases/cart_shop/AddItemToCartUseCase';
import { GetCartByCustomerUseCase } from '../src/andean/app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { UpdateCartItemQuantityUseCase } from '../src/andean/app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../src/andean/app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { CleanCartUseCase } from '../src/andean/app/use_cases/cart_shop/CleanCartUseCase';
import { ApplyDiscountCodeUseCase } from '../src/andean/app/use_cases/cart_shop/ApplyDiscountCodeUseCase';
import { FixtureLoader } from './helpers/fixture-loader';

describe('CartShopController (e2e)', () => {
	let app: INestApplication;
	let addItemToCartUseCase: AddItemToCartUseCase;
	let getCartByCustomerUseCase: GetCartByCustomerUseCase;
	let updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase;
	let removeItemFromCartUseCase: RemoveItemFromCartUseCase;

	// Load fixtures
	const textileFixtures = FixtureLoader.loadTextileProduct();
	const superfoodFixtures = FixtureLoader.loadSuperfood();
	const customerFixtures = FixtureLoader.loadCustomer();
	const cartFixtures = FixtureLoader.loadCart();

	// Mock responses using fixtures
	const mockAddItemResponse = {
		ownerName: textileFixtures.shop.name,
		titulo: textileFixtures.textileProduct.baseInfo.title,
		combinationVariant: textileFixtures.variants[0].combination,
		thumbnailImgUrl: textileFixtures.mediaItems[0].url,
		unitPrice: textileFixtures.variants[0].price,
		quantity: 2,
		idShoppingCartItem: cartFixtures.cartItems[0].id,
		maxStock: textileFixtures.variants[0].stock,
		isDiscountActive: textileFixtures.textileProduct.isDiscountActive,
	};

	const mockGetCartResponse = {
		items: [
			{
				ownerName: textileFixtures.shop.name,
				titulo: textileFixtures.textileProduct.baseInfo.title,
				combinationVariant: textileFixtures.variants[0].combination,
				thumbnailImgUrl: textileFixtures.mediaItems[0].url,
				unitPrice: textileFixtures.variants[0].price,
				quantity: 2,
				idShoppingCartItem: cartFixtures.cartItems[0].id,
				maxStock: textileFixtures.variants[0].stock,
				isDiscountActive: textileFixtures.textileProduct.isDiscountActive,
			},
			{
				ownerName: superfoodFixtures.community.name,
				titulo: superfoodFixtures.superfood.baseInfo.title,
				combinationVariant: superfoodFixtures.variants[0].combination,
				thumbnailImgUrl: superfoodFixtures.mediaItems[0].url,
				unitPrice: superfoodFixtures.variants[0].price,
				quantity: 3,
				idShoppingCartItem: cartFixtures.cartItems[1].id,
				maxStock: superfoodFixtures.variants[0].stock,
				isDiscountActive: superfoodFixtures.superfood.isDiscountActive,
			},
		],
		delivery: 15.0,
		discount: 0,
		taxOrFee: 27.0,
	};

	const mockEmptyCartResponse = {
		items: [],
		delivery: 0,
		discount: 0,
		taxOrFee: 0,
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [CartShopController],
			providers: [
				{
					provide: AddItemToCartUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockAddItemResponse),
					},
				},
				{
					provide: CleanCartUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: GetCartByCustomerUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockGetCartResponse),
					},
				},
				{
					provide: UpdateCartItemQuantityUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: RemoveItemFromCartUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: ApplyDiscountCodeUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							success: true,
							discountApplied: 10,
						}),
					},
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		await app.init();

		addItemToCartUseCase = moduleFixture.get<AddItemToCartUseCase>(AddItemToCartUseCase);
		getCartByCustomerUseCase = moduleFixture.get<GetCartByCustomerUseCase>(GetCartByCustomerUseCase);
		updateCartItemQuantityUseCase = moduleFixture.get<UpdateCartItemQuantityUseCase>(
			UpdateCartItemQuantityUseCase,
		);
		removeItemFromCartUseCase = moduleFixture.get<RemoveItemFromCartUseCase>(RemoveItemFromCartUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /users/customers/:userId/cart/items', () => {
		const customerId = customerFixtures.customer.id;
		const addItemDto = {
			variantId: textileFixtures.variants[0].id,
			quantity: 2,
		};

		it('should add an item to cart and return enriched product info', () => {
			jest.spyOn(addItemToCartUseCase, 'handle').mockResolvedValueOnce(mockAddItemResponse);

			return request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send(addItemDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('ownerName', textileFixtures.shop.name);
					expect(res.body).toHaveProperty('titulo', textileFixtures.textileProduct.baseInfo.title);
					expect(res.body).toHaveProperty('combinationVariant');
					expect(res.body.combinationVariant).toEqual(textileFixtures.variants[0].combination);
					expect(res.body).toHaveProperty('thumbnailImgUrl', textileFixtures.mediaItems[0].url);
					expect(res.body).toHaveProperty('unitPrice', textileFixtures.variants[0].price);
					expect(res.body).toHaveProperty('quantity', 2);
					expect(res.body).toHaveProperty('idShoppingCartItem');
					expect(res.body).toHaveProperty('maxStock', textileFixtures.variants[0].stock);
					expect(res.body).toHaveProperty('isDiscountActive', false);
				});
		});

		it('should call the use case with correct parameters', async () => {
			const spy = jest.spyOn(addItemToCartUseCase, 'handle');

			await request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send(addItemDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(customerId, addItemDto);
		});

		it('should return 400 when quantity is less than 1', () => {
			const invalidDto = {
				variantId: textileFixtures.variants[0].id,
				quantity: 0,
			};

			return request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when quantity is missing', () => {
			const invalidDto = {
				variantId: textileFixtures.variants[0].id,
			};

			return request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when variantId is missing', () => {
			const invalidDto = {
				quantity: 2,
			};

			return request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should handle adding superfood items', () => {
			const superfoodResponse = {
				ownerName: superfoodFixtures.community.name,
				titulo: superfoodFixtures.superfood.baseInfo.title,
				combinationVariant: superfoodFixtures.variants[0].combination,
				thumbnailImgUrl: superfoodFixtures.mediaItems[0].url,
				unitPrice: superfoodFixtures.variants[0].price,
				quantity: 1,
				idShoppingCartItem: 'cart-item-new',
				maxStock: superfoodFixtures.variants[0].stock,
				isDiscountActive: false,
			};

			jest.spyOn(addItemToCartUseCase, 'handle').mockResolvedValueOnce(superfoodResponse);

			return request(app.getHttpServer())
				.post(`/users/customers/${customerId}/cart/items`)
				.send({
					variantId: superfoodFixtures.variants[0].id,
					quantity: 1,
				})
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('ownerName', superfoodFixtures.community.name);
					expect(res.body).toHaveProperty('titulo', superfoodFixtures.superfood.baseInfo.title);
				});
		});
	});

	describe('GET /users/customers/:userId/cart', () => {
		const customerId = customerFixtures.customer.id;

		it('should get cart with enriched items list', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('items');
					expect(res.body).toHaveProperty('delivery', 15.0);
					expect(res.body).toHaveProperty('discount', 0);
					expect(res.body).toHaveProperty('taxOrFee', 27.0);
					expect(Array.isArray(res.body.items)).toBe(true);
					expect(res.body.items).toHaveLength(2);
				});
		});

		it('should return items with complete product information', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const firstItem = res.body.items[0];
					expect(firstItem).toHaveProperty('ownerName');
					expect(firstItem).toHaveProperty('titulo');
					expect(firstItem).toHaveProperty('combinationVariant');
					expect(firstItem).toHaveProperty('thumbnailImgUrl');
					expect(firstItem).toHaveProperty('unitPrice');
					expect(firstItem).toHaveProperty('quantity');
					expect(firstItem).toHaveProperty('idShoppingCartItem');
					expect(firstItem).toHaveProperty('maxStock');
					expect(firstItem).toHaveProperty('isDiscountActive');
				});
		});

		it('should return textile product with shop owner name', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const textileItem = res.body.items[0];
					expect(textileItem.ownerName).toBe(textileFixtures.shop.name);
					expect(textileItem.titulo).toBe(textileFixtures.textileProduct.baseInfo.title);
					expect(textileItem.combinationVariant).toEqual(textileFixtures.variants[0].combination);
				});
		});

		it('should return superfood with community owner name', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const superfoodItem = res.body.items[1];
					expect(superfoodItem.ownerName).toBe(superfoodFixtures.community.name);
					expect(superfoodItem.titulo).toBe(superfoodFixtures.superfood.baseInfo.title);
					expect(superfoodItem.combinationVariant).toEqual(superfoodFixtures.variants[0].combination);
				});
		});

		it('should call the use case with correct customerId', async () => {
			const spy = jest.spyOn(getCartByCustomerUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(customerId);
		});

		it('should return empty cart for new customer', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockEmptyCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('items', []);
					expect(res.body).toHaveProperty('delivery', 0);
					expect(res.body).toHaveProperty('discount', 0);
					expect(res.body).toHaveProperty('taxOrFee', 0);
				});
		});

		it('should return cart with correct calculated totals', () => {
			jest.spyOn(getCartByCustomerUseCase, 'handle').mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/users/customers/${customerId}/cart`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					// Verify totals are numbers
					expect(typeof res.body.delivery).toBe('number');
					expect(typeof res.body.discount).toBe('number');
					expect(typeof res.body.taxOrFee).toBe('number');

					// Verify specific values from mock
					expect(res.body.delivery).toBe(15.0);
					expect(res.body.discount).toBe(0);
					expect(res.body.taxOrFee).toBe(27.0);
				});
		});
	});

	describe('PATCH /users/customers/:userId/cart/items/:itemId/quantity/:quantityDelta', () => {
		const customerId = customerFixtures.customer.id;
		const cartItemId = cartFixtures.cartItems[0].id;
		const updateDto = {
			quantity: 5,
		};

		const mockUpdateResponse = {
			quantity: 5,
			idShoppingCartItem: cartItemId,
			maxStock: textileFixtures.variants[0].stock,
		};

		it('should update cart item quantity', () => {
			jest.spyOn(updateCartItemQuantityUseCase, 'handle').mockResolvedValueOnce(mockUpdateResponse);

			return request(app.getHttpServer())
				.patch(`/users/customers/${customerId}/cart/items/${cartItemId}/quantity/5`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('quantity', 5);
					expect(res.body).toHaveProperty('idShoppingCartItem', cartItemId);
					expect(res.body).toHaveProperty('maxStock');
				});
		});

		it('should call the use case with correct parameters', async () => {
			const spy = jest.spyOn(updateCartItemQuantityUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(`/users/customers/${customerId}/cart/items/${cartItemId}/quantity/5`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(cartItemId, 5);
		});

		it('should return 400 when quantity delta is invalid', () => {
			return request(app.getHttpServer())
				.patch(`/users/customers/${customerId}/cart/items/${cartItemId}/quantity/invalid`)
				.expect(HttpStatus.BAD_REQUEST);
		});


	});

	describe('DELETE /users/customers/:userId/cart/items/:itemId', () => {
		const customerId = customerFixtures.customer.id;
		const cartItemId = cartFixtures.cartItems[0].id;

		it('should remove item from cart', () => {
			jest.spyOn(removeItemFromCartUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/users/customers/${customerId}/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct parameters', async () => {
			const spy = jest.spyOn(removeItemFromCartUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/users/customers/${customerId}/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(customerId, cartItemId);
		});
	});
});

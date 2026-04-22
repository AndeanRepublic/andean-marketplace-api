import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { CartShopController } from '../src/andean/infra/controllers/cartShop.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { AddItemToCartUseCase } from '../src/andean/app/use_cases/cart_shop/AddItemToCartUseCase';
import { GetCartByCustomerUseCase } from '../src/andean/app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { UpdateCartItemQuantityUseCase } from '../src/andean/app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../src/andean/app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { CleanCartUseCase } from '../src/andean/app/use_cases/cart_shop/CleanCartUseCase';
import { ApplyDiscountCodeUseCase } from '../src/andean/app/use_cases/cart_shop/ApplyDiscountCodeUseCase';
import { FixtureLoader } from './helpers/fixture-loader';
import { ProductType } from '../src/andean/domain/enums/ProductType';

describe('CartShopController (e2e)', () => {
	// Load fixtures
	const textileFixtures = FixtureLoader.loadTextileProduct();
	const superfoodFixtures = FixtureLoader.loadSuperfood();
	const customerFixtures = FixtureLoader.loadCustomer();
	const cartFixtures = FixtureLoader.loadCart();
	const boxFixtures = FixtureLoader.loadBox();

	// Mock responses using fixtures
	const mockAddItemResponse = {
		productId: textileFixtures.entity.id,
		variantId: textileFixtures.variants[0].id,
		ownerName: textileFixtures.shop.name,
		title: textileFixtures.entity.baseInfo.title,
		combinationVariant: textileFixtures.variants[0].combination,
		thumbnailImgUrl: textileFixtures.mediaItems[0].url,
		unitPrice: textileFixtures.variants[0].price,
		quantity: 2,
		idShoppingCartItem: cartFixtures.cartItems[0].id,
		maxStock: textileFixtures.variants[0].stock,
		isDiscountActive: textileFixtures.entity.isDiscountActive,
		productType: ProductType.TEXTILE,
	};

	const mockGetCartResponse = {
		items: [
			{
				productId: textileFixtures.entity.id,
				variantId: textileFixtures.variants[0].id,
				ownerName: textileFixtures.shop.name,
				title: textileFixtures.entity.baseInfo.title,
				combinationVariant: textileFixtures.variants[0].combination,
				thumbnailImgUrl: textileFixtures.mediaItems[0].url,
				unitPrice: textileFixtures.variants[0].price,
				quantity: 2,
				idShoppingCartItem: cartFixtures.cartItems[0].id,
				maxStock: textileFixtures.variants[0].stock,
				isDiscountActive: textileFixtures.entity.isDiscountActive,
				productType: ProductType.TEXTILE,
			},
			{
				productId: superfoodFixtures.superfood.id,
				variantId: superfoodFixtures.variants[0].id,
				ownerName: superfoodFixtures.community.name,
				title: superfoodFixtures.superfood.baseInfo.title,
				combinationVariant: superfoodFixtures.variants[0].combination,
				thumbnailImgUrl: superfoodFixtures.mediaItems[0].url,
				unitPrice: superfoodFixtures.variants[0].price,
				quantity: 3,
				idShoppingCartItem: cartFixtures.cartItems[1].id,
				maxStock: superfoodFixtures.variants[0].stock,
				isDiscountActive: superfoodFixtures.superfood.isDiscountActive,
				productType: ProductType.SUPERFOOD,
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

	// Mock response for adding a box item to the cart
	const mockAddBoxItemResponse = {
		ownerName: '',
		title: boxFixtures.entity.name,
		combinationVariant: {},
		thumbnailImgUrl: boxFixtures.entity.thumbnailImageId,
		unitPrice: boxFixtures.entity.price,
		quantity: 1,
		idShoppingCartItem: 'cart-item-box-001',
		maxStock: 1,
		isDiscountActive: false,
		productType: ProductType.BOX,
		boxContent: [
			{
				title: boxFixtures.relatedProducts.superfoods[0].baseInfo.title,
				productType: ProductType.SUPERFOOD,
			},
			{
				title: boxFixtures.relatedProducts.superfoods[1].baseInfo.title,
				productType: ProductType.SUPERFOOD,
			},
			{
				title: boxFixtures.relatedProducts.textiles[0].product.baseInfo.title,
				productType: ProductType.TEXTILE,
			},
		],
	};

	// Mock response for GET cart including a box item
	const mockGetCartWithBoxResponse = {
		items: [
			{
				ownerName: textileFixtures.shop.name,
				title: textileFixtures.entity.baseInfo.title,
				combinationVariant: textileFixtures.variants[0].combination,
				thumbnailImgUrl: textileFixtures.mediaItems[0].url,
				unitPrice: textileFixtures.variants[0].price,
				quantity: 2,
				idShoppingCartItem: cartFixtures.cartItems[0].id,
				maxStock: textileFixtures.variants[0].stock,
				isDiscountActive: textileFixtures.entity.isDiscountActive,
				productType: ProductType.TEXTILE,
			},
			{
				ownerName: '',
				title: boxFixtures.entity.name,
				combinationVariant: {},
				thumbnailImgUrl: boxFixtures.entity.thumbnailImageId,
				unitPrice: boxFixtures.entity.price,
				quantity: 1,
				idShoppingCartItem: 'cart-item-box-001',
				maxStock: 1,
				isDiscountActive: false,
				productType: ProductType.BOX,
				boxContent: [
					{
						title: boxFixtures.relatedProducts.superfoods[0].baseInfo.title,
						productType: ProductType.SUPERFOOD,
					},
					{
						title: boxFixtures.relatedProducts.superfoods[1].baseInfo.title,
						productType: ProductType.SUPERFOOD,
					},
					{
						title:
							boxFixtures.relatedProducts.textiles[0].product.baseInfo.title,
						productType: ProductType.TEXTILE,
					},
				],
			},
		],
		delivery: 15.0,
		discount: 0,
		taxOrFee: 27.0,
	};

	// ─── Helper to build isolated app per test ────────────────────────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
		useCaseMocks: {
			getCart?: any;
			addItem?: any;
			cleanCart?: any;
			removeItem?: any;
			updateQuantity?: any;
			applyDiscount?: any;
		} = {},
	): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CartShopController],
			providers: [
				{
					provide: AddItemToCartUseCase,
					useValue: {
						handle:
							useCaseMocks.addItem ??
							jest.fn().mockResolvedValue(mockAddItemResponse),
					},
				},
				{
					provide: CleanCartUseCase,
					useValue: {
						handle:
							useCaseMocks.cleanCart ?? jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: GetCartByCustomerUseCase,
					useValue: {
						handle:
							useCaseMocks.getCart ??
							jest.fn().mockResolvedValue(mockGetCartResponse),
					},
				},
				{
					provide: UpdateCartItemQuantityUseCase,
					useValue: {
						handle:
							useCaseMocks.updateQuantity ??
							jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: RemoveItemFromCartUseCase,
					useValue: {
						handle:
							useCaseMocks.removeItem ?? jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: ApplyDiscountCodeUseCase,
					useValue: {
						handle:
							useCaseMocks.applyDiscount ??
							jest.fn().mockResolvedValue({
								success: true,
								discountApplied: 10,
							}),
					},
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(authUser ? createAllowAllGuard(authUser) : createDenyAllGuard())
			.compile();

		const app = module.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();
		return app;
	}

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ─── POST /cart/items ─────────────────────────────────────────────
	describe('POST /cart/items', () => {
		const addItemDto = {
			variantId: textileFixtures.variants[0].id,
			quantity: 2,
		};

		it('should add an item to cart and return enriched product info', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const addUseCase = app.get(AddItemToCartUseCase);
			jest
				.spyOn(addUseCase, 'handle')
				.mockResolvedValueOnce(mockAddItemResponse);

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(addItemDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						ownerName: textileFixtures.shop.name,
						title: textileFixtures.entity.baseInfo.title,
						combinationVariant: expect.any(Object),
						thumbnailImgUrl: textileFixtures.mediaItems[0].url,
						unitPrice: textileFixtures.variants[0].price,
						quantity: 2,
						idShoppingCartItem: expect.any(String),
						maxStock: textileFixtures.variants[0].stock,
						isDiscountActive: false,
					});
				});

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const addUseCase = app.get(AddItemToCartUseCase);
			const spy = jest.spyOn(addUseCase, 'handle');

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(addItemDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
				addItemDto,
				undefined,
			);

			await app.close();
		});

		it('should return 400 when quantity is less than 1', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const invalidDto = {
				variantId: textileFixtures.variants[0].id,
				quantity: 0,
			};

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);

			await app.close();
		});

		it('should return 400 when quantity is missing', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const invalidDto = {
				variantId: textileFixtures.variants[0].id,
			};

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);

			await app.close();
		});

		it('should return 400 when variantId is missing', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const invalidDto = {
				quantity: 2,
			};

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);

			await app.close();
		});

		it('should handle adding superfood items', async () => {
			const superfoodResponse = {
				ownerName: superfoodFixtures.community.name,
				title: superfoodFixtures.superfood.baseInfo.title,
				combinationVariant: superfoodFixtures.variants[0].combination,
				thumbnailImgUrl: superfoodFixtures.mediaItems[0].url,
				unitPrice: superfoodFixtures.variants[0].price,
				quantity: 1,
				idShoppingCartItem: 'cart-item-new',
				maxStock: superfoodFixtures.variants[0].stock,
				isDiscountActive: false,
				productType: ProductType.SUPERFOOD,
			};

			const app = await buildApp(mockAuthUsers.customer, {
				addItem: jest.fn().mockResolvedValue(superfoodResponse),
			});

			await request(app.getHttpServer())
				.post('/cart/items')
				.send({
					variantId: superfoodFixtures.variants[0].id,
					quantity: 1,
				})
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty(
						'ownerName',
						superfoodFixtures.community.name,
					);
					expect(res.body).toHaveProperty(
						'title',
						superfoodFixtures.superfood.baseInfo.title,
					);
				});

			await app.close();
		});

		it('should handle adding a box item with boxContent', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				addItem: jest.fn().mockResolvedValue(mockAddBoxItemResponse),
			});

			await request(app.getHttpServer())
				.post('/cart/items')
				.send({
					variantId: boxFixtures.entity.id,
					quantity: 1,
				})
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						ownerName: '',
						title: boxFixtures.entity.name,
						combinationVariant: {},
						unitPrice: boxFixtures.entity.price,
						quantity: 1,
						maxStock: 1,
						isDiscountActive: false,
						productType: ProductType.BOX,
					});
					expect(res.body).toHaveProperty('boxContent');
					expect(Array.isArray(res.body.boxContent)).toBe(true);
					expect(res.body.boxContent).toHaveLength(3);
				});

			await app.close();
		});

		it('should return box item with correct boxContent product types', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				addItem: jest.fn().mockResolvedValue(mockAddBoxItemResponse),
			});

			await request(app.getHttpServer())
				.post('/cart/items')
				.send({
					variantId: boxFixtures.entity.id,
					quantity: 1,
				})
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					const boxContent = res.body.boxContent;
					expect(boxContent[0]).toEqual({
						title: boxFixtures.relatedProducts.superfoods[0].baseInfo.title,
						productType: ProductType.SUPERFOOD,
					});
					expect(boxContent[1]).toEqual({
						title: boxFixtures.relatedProducts.superfoods[1].baseInfo.title,
						productType: ProductType.SUPERFOOD,
					});
					expect(boxContent[2]).toEqual({
						title:
							boxFixtures.relatedProducts.textiles[0].product.baseInfo.title,
						productType: ProductType.TEXTILE,
					});
				});

			await app.close();
		});
	});

	// ─── POST /cart/items — Auth ──────────────────────────────────────
	describe('POST /cart/items — Auth', () => {
		const addItemDto = {
			variantId: textileFixtures.variants[0].id,
			quantity: 2,
		};

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(addItemDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when SELLER has no CustomerProfile', async () => {
			const app = await buildApp(mockAuthUsers.seller, {
				addItem: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(addItemDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 201 when ADMIN bypasses ownership check', async () => {
			const app = await buildApp(mockAuthUsers.admin, {
				addItem: jest.fn().mockResolvedValue(mockAddItemResponse),
			});
			const addUseCase = app.get(AddItemToCartUseCase);
			const spy = jest.spyOn(addUseCase, 'handle');

			await request(app.getHttpServer())
				.post('/cart/items')
				.send(addItemDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
				addItemDto,
				undefined,
			);

			await app.close();
		});
	});

	// ─── GET /cart ────────────────────────────────────────────────────
	describe('GET /cart', () => {
		it('should get cart with enriched items list', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('items');
					expect(res.body).toHaveProperty('delivery', 15.0);
					expect(res.body).toHaveProperty('discount', 0);
					expect(res.body).toHaveProperty('taxOrFee', 27.0);
					expect(Array.isArray(res.body.items)).toBe(true);
					expect(res.body.items).toHaveLength(2);
				});

			await app.close();
		});

		it('should return items with complete product information', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const firstItem = res.body.items[0];
					expect(firstItem).toHaveProperty('ownerName');
					expect(firstItem).toHaveProperty('title');
					expect(firstItem).toHaveProperty('combinationVariant');
					expect(firstItem).toHaveProperty('thumbnailImgUrl');
					expect(firstItem).toHaveProperty('unitPrice');
					expect(firstItem).toHaveProperty('quantity');
					expect(firstItem).toHaveProperty('idShoppingCartItem');
					expect(firstItem).toHaveProperty('maxStock');
					expect(firstItem).toHaveProperty('isDiscountActive');
				});

			await app.close();
		});

		it('should return textile product with shop owner name', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const textileItem = res.body.items[0];
					expect(textileItem.ownerName).toBe(textileFixtures.shop.name);
					expect(textileItem.title).toBe(textileFixtures.entity.baseInfo.title);
					expect(textileItem.combinationVariant).toEqual(
						textileFixtures.variants[0].combination,
					);
				});

			await app.close();
		});

		it('should return superfood with community owner name', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const superfoodItem = res.body.items[1];
					expect(superfoodItem.ownerName).toBe(
						superfoodFixtures.community.name,
					);
					expect(superfoodItem.title).toBe(
						superfoodFixtures.superfood.baseInfo.title,
					);
					expect(superfoodItem.combinationVariant).toEqual(
						superfoodFixtures.variants[0].combination,
					);
				});

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const getCartUseCase = app.get(GetCartByCustomerUseCase);
			const spy = jest.spyOn(getCartUseCase, 'handle');

			await request(app.getHttpServer()).get('/cart').expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
				undefined,
			);

			await app.close();
		});

		it('should return empty cart for new customer', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockEmptyCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('items', []);
					expect(res.body).toHaveProperty('delivery', 0);
					expect(res.body).toHaveProperty('discount', 0);
					expect(res.body).toHaveProperty('taxOrFee', 0);
				});

			await app.close();
		});

		it('should return cart with correct calculated totals', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
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

			await app.close();
		});

		it('should return cart with box item containing boxContent', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartWithBoxResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body.items).toHaveLength(2);

					const boxItem = res.body.items[1];
					expect(boxItem.productType).toBe(ProductType.BOX);
					expect(boxItem.ownerName).toBe('');
					expect(boxItem.title).toBe(boxFixtures.entity.name);
					expect(boxItem.combinationVariant).toEqual({});
					expect(boxItem.quantity).toBe(1);
					expect(boxItem.maxStock).toBe(1);
					expect(boxItem.isDiscountActive).toBe(false);
				});

			await app.close();
		});

		it('should return box item with correct boxContent structure', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartWithBoxResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const boxItem = res.body.items[1];
					expect(boxItem).toHaveProperty('boxContent');
					expect(Array.isArray(boxItem.boxContent)).toBe(true);
					expect(boxItem.boxContent).toHaveLength(3);

					// Verify each contained product has title and productType
					boxItem.boxContent.forEach((contentItem: any) => {
						expect(contentItem).toHaveProperty('title');
						expect(contentItem).toHaveProperty('productType');
						expect([ProductType.SUPERFOOD, ProductType.TEXTILE]).toContain(
							contentItem.productType,
						);
					});
				});

			await app.close();
		});

		it('should return box item boxContent with correct product types per item', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartWithBoxResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const boxContent = res.body.items[1].boxContent;

					// 2 superfoods + 1 textile
					const superfoodItems = boxContent.filter(
						(c: any) => c.productType === ProductType.SUPERFOOD,
					);
					const textileItems = boxContent.filter(
						(c: any) => c.productType === ProductType.TEXTILE,
					);

					expect(superfoodItems).toHaveLength(2);
					expect(textileItems).toHaveLength(1);

					expect(superfoodItems[0].title).toBe(
						boxFixtures.relatedProducts.superfoods[0].baseInfo.title,
					);
					expect(superfoodItems[1].title).toBe(
						boxFixtures.relatedProducts.superfoods[1].baseInfo.title,
					);
					expect(textileItems[0].title).toBe(
						boxFixtures.relatedProducts.textiles[0].product.baseInfo.title,
					);
				});

			await app.close();
		});

		it('should not include boxContent on non-box items', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				getCart: jest.fn().mockResolvedValue(mockGetCartWithBoxResponse),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const textileItem = res.body.items[0];
					expect(textileItem.productType).toBe(ProductType.TEXTILE);
					expect(textileItem.boxContent).toBeUndefined();
				});

			await app.close();
		});
	});

	// ─── GET /cart — Auth ─────────────────────────────────────────────
	describe('GET /cart — Auth', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when SELLER has no CustomerProfile', async () => {
			const app = await buildApp(mockAuthUsers.seller, {
				getCart: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.get('/cart')
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 200 when ADMIN bypasses ownership check', async () => {
			const app = await buildApp(mockAuthUsers.admin, {
				getCart: jest.fn().mockResolvedValue(mockEmptyCartResponse),
			});
			const getCartUseCase = app.get(GetCartByCustomerUseCase);
			const spy = jest.spyOn(getCartUseCase, 'handle');

			await request(app.getHttpServer()).get('/cart').expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
				undefined,
			);

			await app.close();
		});
	});

	// ─── DELETE /cart ─────────────────────────────────────────────────
	describe('DELETE /cart', () => {
		it('should clean cart and return 204', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				cleanCart: jest.fn().mockResolvedValue(undefined),
			});

			await request(app.getHttpServer())
				.delete('/cart')
				.expect(HttpStatus.NO_CONTENT);

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const cleanUseCase = app.get(CleanCartUseCase);
			const spy = jest.spyOn(cleanUseCase, 'handle');

			await request(app.getHttpServer())
				.delete('/cart')
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
				undefined,
			);

			await app.close();
		});
	});

	// ─── DELETE /cart — Auth ──────────────────────────────────────────
	describe('DELETE /cart — Auth', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.delete('/cart')
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when SELLER has no CustomerProfile', async () => {
			const app = await buildApp(mockAuthUsers.seller, {
				cleanCart: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.delete('/cart')
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 204 when ADMIN bypasses ownership check', async () => {
			const app = await buildApp(mockAuthUsers.admin, {
				cleanCart: jest.fn().mockResolvedValue(undefined),
			});
			const cleanUseCase = app.get(CleanCartUseCase);
			const spy = jest.spyOn(cleanUseCase, 'handle');

			await request(app.getHttpServer())
				.delete('/cart')
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
				undefined,
			);

			await app.close();
		});
	});

	// ─── PATCH /cart/items/:itemId/quantity/:quantityDelta ────────────
	describe('PATCH /cart/items/:itemId/quantity/:quantityDelta', () => {
		const cartItemId = cartFixtures.cartItems[0].id;

		const mockUpdateResponse = {
			quantity: 5,
			idShoppingCartItem: cartItemId,
			maxStock: textileFixtures.variants[0].stock,
		};

		it('should update cart item quantity', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				updateQuantity: jest.fn().mockResolvedValue(mockUpdateResponse),
			});

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/5`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('quantity', 5);
					expect(res.body).toHaveProperty('idShoppingCartItem', cartItemId);
					expect(res.body).toHaveProperty('maxStock');
				});

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				updateQuantity: jest.fn().mockResolvedValue(mockUpdateResponse),
			});
			const updateUseCase = app.get(UpdateCartItemQuantityUseCase);
			const spy = jest.spyOn(updateUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/5`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				5,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
			);

			await app.close();
		});

		it('should return 400 when quantity delta is invalid', async () => {
			const app = await buildApp(mockAuthUsers.customer);

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/invalid`)
				.expect(HttpStatus.BAD_REQUEST);

			await app.close();
		});
	});

	// ─── PATCH /cart/items/:itemId/quantity/:delta — Auth ─────────────
	describe('PATCH /cart/items/:itemId/quantity/:delta — Auth', () => {
		const cartItemId = cartFixtures.cartItems[0].id;

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/1`)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when non-owner tries to update quantity', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				updateQuantity: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/1`)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 404 when cart item does not exist', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				updateQuantity: jest
					.fn()
					.mockRejectedValue(new NotFoundException('CartItem not found')),
			});

			await request(app.getHttpServer())
				.patch(`/cart/items/non-existent-item/quantity/1`)
				.expect(HttpStatus.NOT_FOUND);

			await app.close();
		});

		it('should return 200 when ADMIN bypasses ownership check', async () => {
			const mockUpdateResponse = {
				quantity: 3,
				idShoppingCartItem: cartItemId,
				maxStock: textileFixtures.variants[0].stock,
			};

			const app = await buildApp(mockAuthUsers.admin, {
				updateQuantity: jest.fn().mockResolvedValue(mockUpdateResponse),
			});
			const updateUseCase = app.get(UpdateCartItemQuantityUseCase);
			const spy = jest.spyOn(updateUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/3`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				3,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
			);

			await app.close();
		});
	});

	// ─── DELETE /cart/items/:itemId ───────────────────────────────────
	describe('DELETE /cart/items/:itemId', () => {
		const cartItemId = cartFixtures.cartItems[0].id;

		it('should remove item from cart', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				removeItem: jest.fn().mockResolvedValue(undefined),
			});

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				removeItem: jest.fn().mockResolvedValue(undefined),
			});
			const removeUseCase = app.get(RemoveItemFromCartUseCase);
			const spy = jest.spyOn(removeUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
			);

			await app.close();
		});
	});

	// ─── DELETE /cart/items/:itemId — Auth ────────────────────────────
	describe('DELETE /cart/items/:itemId — Auth', () => {
		const cartItemId = cartFixtures.cartItems[0].id;

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when non-owner tries to remove item', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				removeItem: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 404 when cart item does not exist', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				removeItem: jest
					.fn()
					.mockRejectedValue(new NotFoundException('CartItem not found')),
			});

			await request(app.getHttpServer())
				.delete(`/cart/items/non-existent-item`)
				.expect(HttpStatus.NOT_FOUND);

			await app.close();
		});

		it('should return 204 when ADMIN bypasses ownership check', async () => {
			const app = await buildApp(mockAuthUsers.admin, {
				removeItem: jest.fn().mockResolvedValue(undefined),
			});
			const removeUseCase = app.get(RemoveItemFromCartUseCase);
			const spy = jest.spyOn(removeUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
			);

			await app.close();
		});
	});

	// ─── POST /cart/items/:itemId/discount ────────────────────────────
	describe('POST /cart/items/:itemId/discount', () => {
		const cartItemId = 'item-1';
		const discountDto = { code: 'CODE10' };
		const mockDiscountResponse = {
			percentage: 10,
			discount: 5,
			cartItemId,
		};

		it('should apply discount to cart item', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				applyDiscount: jest.fn().mockResolvedValue(mockDiscountResponse),
			});

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.CREATED);

			await app.close();
		});

		it('should call the use case with correct parameters', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				applyDiscount: jest.fn().mockResolvedValue(mockDiscountResponse),
			});
			const discountUseCase = app.get(ApplyDiscountCodeUseCase);
			const spy = jest.spyOn(discountUseCase, 'handle');

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				discountDto.code,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
			);

			await app.close();
		});
	});

	// ─── POST /cart/items/:itemId/discount — Auth ─────────────────────
	describe('POST /cart/items/:itemId/discount — Auth', () => {
		const cartItemId = 'item-1';
		const discountDto = { code: 'CODE10' };

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when non-owner tries to apply discount', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				applyDiscount: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 404 when cart item does not exist', async () => {
			const app = await buildApp(mockAuthUsers.customer, {
				applyDiscount: jest
					.fn()
					.mockRejectedValue(new NotFoundException('CartItem not found')),
			});

			await request(app.getHttpServer())
				.post(`/cart/items/non-existent-item/discount`)
				.send(discountDto)
				.expect(HttpStatus.NOT_FOUND);

			await app.close();
		});

		it('should return 201 when ADMIN bypasses ownership check', async () => {
			const mockDiscountResponse = {
				percentage: 10,
				discount: 5,
				cartItemId,
			};

			const app = await buildApp(mockAuthUsers.admin, {
				applyDiscount: jest.fn().mockResolvedValue(mockDiscountResponse),
			});
			const discountUseCase = app.get(ApplyDiscountCodeUseCase);
			const spy = jest.spyOn(discountUseCase, 'handle');

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(
				cartItemId,
				discountDto.code,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
			);

			await app.close();
		});

		it('should return 403 before discount validation when non-owner sends valid code', async () => {
			// Ownership is checked BEFORE discount validation per spec
			const app = await buildApp(mockAuthUsers.customer, {
				applyDiscount: jest
					.fn()
					.mockRejectedValue(
						new ForbiddenException('You can only access your own cart'),
					),
			});
			const discountUseCase = app.get(ApplyDiscountCodeUseCase);
			const spy = jest.spyOn(discountUseCase, 'handle');

			await request(app.getHttpServer())
				.post(`/cart/items/${cartItemId}/discount`)
				.send(discountDto)
				.expect(HttpStatus.FORBIDDEN);

			// Use case was called (ownership enforced inside use case, before discount logic)
			expect(spy).toHaveBeenCalled();

			await app.close();
		});
	});
});

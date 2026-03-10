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
import { ProductType } from '../src/andean/domain/enums/ProductType';

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
	const boxFixtures = FixtureLoader.loadBox();

	// Mock responses using fixtures
	const mockAddItemResponse = {
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
		title: boxFixtures.entity.title,
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
				title: boxFixtures.entity.title,
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

		addItemToCartUseCase =
			moduleFixture.get<AddItemToCartUseCase>(AddItemToCartUseCase);
		getCartByCustomerUseCase = moduleFixture.get<GetCartByCustomerUseCase>(
			GetCartByCustomerUseCase,
		);
		updateCartItemQuantityUseCase =
			moduleFixture.get<UpdateCartItemQuantityUseCase>(
				UpdateCartItemQuantityUseCase,
			);
		removeItemFromCartUseCase = moduleFixture.get<RemoveItemFromCartUseCase>(
			RemoveItemFromCartUseCase,
		);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /cart/items', () => {
		const customerId = customerFixtures.customer.id;
		const addItemDto = {
			variantId: textileFixtures.variants[0].id,
			quantity: 2,
		};

		it('should add an item to cart and return enriched product info', () => {
			jest
				.spyOn(addItemToCartUseCase, 'handle')
				.mockResolvedValueOnce(mockAddItemResponse);

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
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
		});

		it('should call the use case with correct parameters', async () => {
			const spy = jest.spyOn(addItemToCartUseCase, 'handle');

			await request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
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
				.post(`/cart/items?customerId=${customerId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when quantity is missing', () => {
			const invalidDto = {
				variantId: textileFixtures.variants[0].id,
			};

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when variantId is missing', () => {
			const invalidDto = {
				quantity: 2,
			};

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should handle adding superfood items', () => {
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

			jest
				.spyOn(addItemToCartUseCase, 'handle')
				.mockResolvedValueOnce(superfoodResponse);

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
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
		});

		it('should handle adding a box item with boxContent', () => {
			jest
				.spyOn(addItemToCartUseCase, 'handle')
				.mockResolvedValueOnce(mockAddBoxItemResponse);

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
				.send({
					variantId: boxFixtures.entity.id,
					quantity: 1,
				})
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						ownerName: '',
						title: boxFixtures.entity.title,
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
		});

		it('should return box item with correct boxContent product types', () => {
			jest
				.spyOn(addItemToCartUseCase, 'handle')
				.mockResolvedValueOnce(mockAddBoxItemResponse);

			return request(app.getHttpServer())
				.post(`/cart/items?customerId=${customerId}`)
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
		});
	});

	describe('GET /cart', () => {
		const customerId = customerFixtures.customer.id;

		it('should get cart with enriched items list', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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
		});

		it('should return textile product with shop owner name', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const textileItem = res.body.items[0];
					expect(textileItem.ownerName).toBe(textileFixtures.shop.name);
					expect(textileItem.title).toBe(
						textileFixtures.entity.baseInfo.title,
					);
					expect(textileItem.combinationVariant).toEqual(
						textileFixtures.variants[0].combination,
					);
				});
		});

		it('should return superfood with community owner name', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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
		});

		it('should call the use case with correct customerId', async () => {
			const spy = jest.spyOn(getCartByCustomerUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(customerId, undefined);
		});

		it('should return empty cart for new customer', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockEmptyCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('items', []);
					expect(res.body).toHaveProperty('delivery', 0);
					expect(res.body).toHaveProperty('discount', 0);
					expect(res.body).toHaveProperty('taxOrFee', 0);
				});
		});

		it('should return cart with correct calculated totals', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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

		it('should return cart with box item containing boxContent', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartWithBoxResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body.items).toHaveLength(2);

					const boxItem = res.body.items[1];
					expect(boxItem.productType).toBe(ProductType.BOX);
					expect(boxItem.ownerName).toBe('');
					expect(boxItem.title).toBe(boxFixtures.entity.title);
					expect(boxItem.combinationVariant).toEqual({});
					expect(boxItem.quantity).toBe(1);
					expect(boxItem.maxStock).toBe(1);
					expect(boxItem.isDiscountActive).toBe(false);
				});
		});

		it('should return box item with correct boxContent structure', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartWithBoxResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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
		});

		it('should return box item boxContent with correct product types per item', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartWithBoxResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
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
		});

		it('should not include boxContent on non-box items', () => {
			jest
				.spyOn(getCartByCustomerUseCase, 'handle')
				.mockResolvedValueOnce(mockGetCartWithBoxResponse);

			return request(app.getHttpServer())
				.get(`/cart?customerId=${customerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const textileItem = res.body.items[0];
					expect(textileItem.productType).toBe(ProductType.TEXTILE);
					expect(textileItem.boxContent).toBeUndefined();
				});
		});
	});

	describe('PATCH /cart/items/:itemId/quantity/:quantityDelta', () => {
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
			jest
				.spyOn(updateCartItemQuantityUseCase, 'handle')
				.mockResolvedValueOnce(mockUpdateResponse);

			return request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/5`)
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
				.patch(`/cart/items/${cartItemId}/quantity/5`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(cartItemId, 5);
		});

		it('should return 400 when quantity delta is invalid', () => {
			return request(app.getHttpServer())
				.patch(`/cart/items/${cartItemId}/quantity/invalid`)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('DELETE /cart/items/:itemId', () => {
		const customerId = customerFixtures.customer.id;
		const cartItemId = cartFixtures.cartItems[0].id;

		it('should remove item from cart', () => {
			jest
				.spyOn(removeItemFromCartUseCase, 'handle')
				.mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct parameters', async () => {
			const spy = jest.spyOn(removeItemFromCartUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/cart/items/${cartItemId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(cartItemId);
		});
	});
});

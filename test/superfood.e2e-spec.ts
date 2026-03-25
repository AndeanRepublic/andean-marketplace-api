import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { SuperfoodController } from '../src/andean/infra/controllers/superfoodControllers/superfood.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetByIdSuperfoodProductDetailUseCase } from '../src/andean/app/use_cases/superfoods/GetByIdSuperfoodProductDetailUseCase';
import { GetAllSuperfoodProductsUseCase } from '../src/andean/app/use_cases/superfoods/GetAllSuperfoodProductsUseCase';
import { UpdateSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/DeleteSuperfoodProductUseCase';
import { CreateDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/CreateDetailSourceProductUseCase';
import { UpdateDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/UpdateDetailSourceProductUseCase';
import { DeleteDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/DeleteDetailSourceProductUseCase';
import { SuperfoodProduct } from '../src/andean/domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductStatus } from '../src/andean/domain/enums/SuperfoodProductStatus';
import { SuperfoodOwnerType } from '../src/andean/domain/enums/SuperfoodOwnerType';
import { SuperfoodColor } from '../src/andean/domain/enums/SuperfoodColor';
import { ProductSortBy } from '../src/andean/domain/enums/ProductSortBy';
import { SuperfoodProductListItem } from '../src/andean/app/models/superfoods/SuperfoodProductListItem';
import { FixtureLoader } from './helpers/fixture-loader';

describe('SuperfoodController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodProductUseCase: CreateSuperfoodProductUseCase;
	let getByIdSuperfoodProductDetailUseCase: GetByIdSuperfoodProductDetailUseCase;
	let getAllSuperfoodProductsUseCase: GetAllSuperfoodProductsUseCase;
	let updateSuperfoodProductUseCase: UpdateSuperfoodProductUseCase;
	let deleteSuperfoodProductUseCase: DeleteSuperfoodProductUseCase;
	let createDetailSourceProductUseCase: CreateDetailSourceProductUseCase;
	let updateDetailSourceProductUseCase: UpdateDetailSourceProductUseCase;
	let deleteDetailSourceProductUseCase: DeleteDetailSourceProductUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadSuperfoodProduct();
	const mockBasicInfo = fixture.entity.baseInfo;
	const mockPriceInventory = fixture.entity.priceInventory;
	const mockSuperfoodProduct = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as SuperfoodProduct;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;
	const mockSuperfoodProductListItem = fixture.listItem;
	const mockPaginatedResponse = fixture.paginatedResponse;
	const mockDetailResponse = fixture.detailResponse;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodController],
			providers: [
				{
					provide: CreateSuperfoodProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
					},
				},
				{
					provide: GetByIdSuperfoodProductDetailUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockDetailResponse) },
				},
				{
					provide: GetAllSuperfoodProductsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
					},
				},
				{
					provide: UpdateSuperfoodProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockSuperfoodProduct,
							baseInfo: { ...mockBasicInfo, title: updateDto.baseInfo.title },
							priceInventory: {
								...mockPriceInventory,
								basePrice: updateDto.priceInventory.basePrice,
								totalStock: updateDto.priceInventory.totalStock,
							},
						}),
					},
				},
				{
					provide: DeleteSuperfoodProductUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: CreateDetailSourceProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
					},
				},
				{
					provide: UpdateDetailSourceProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
					},
				},
				{
					provide: DeleteDetailSourceProductUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(mockAuthUsers.seller))
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

		createSuperfoodProductUseCase = moduleFixture.get(
			CreateSuperfoodProductUseCase,
		);
		getByIdSuperfoodProductDetailUseCase = moduleFixture.get(
			GetByIdSuperfoodProductDetailUseCase,
		);
		getAllSuperfoodProductsUseCase = moduleFixture.get(
			GetAllSuperfoodProductsUseCase,
		);
		createDetailSourceProductUseCase = moduleFixture.get(
			CreateDetailSourceProductUseCase,
		);
		updateDetailSourceProductUseCase = moduleFixture.get(
			UpdateDetailSourceProductUseCase,
		);
		deleteDetailSourceProductUseCase = moduleFixture.get(
			DeleteDetailSourceProductUseCase,
		);
		updateSuperfoodProductUseCase = moduleFixture.get(
			UpdateSuperfoodProductUseCase,
		);
		deleteSuperfoodProductUseCase = moduleFixture.get(
			DeleteSuperfoodProductUseCase,
		);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfoods', () => {
		it('should create a new superfood product', () => {
			jest
				.spyOn(createSuperfoodProductUseCase, 'handle')
				.mockResolvedValueOnce(mockSuperfoodProduct);
			return request(app.getHttpServer())
				.post('/superfoods')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						status: SuperfoodProductStatus.PUBLISHED,
						baseInfo: expect.objectContaining({ title: mockBasicInfo.title }),
						priceInventory: expect.objectContaining({
							basePrice: mockPriceInventory.basePrice,
						}),
						categoryId: expect.any(String),
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when baseInfo.title is missing', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({
					...createDto,
					baseInfo: { ...createDto.baseInfo, title: undefined },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when baseInfo.ownerId is missing', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({
					...createDto,
					baseInfo: { ...createDto.baseInfo, ownerId: undefined },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basePrice is less than or equal to 0', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({
					...createDto,
					priceInventory: { ...createDto.priceInventory, basePrice: 0 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when totalStock is negative', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({
					...createDto,
					priceInventory: { ...createDto.priceInventory, totalStock: -1 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create a superfood with color field', () => {
			jest
				.spyOn(createSuperfoodProductUseCase, 'handle')
				.mockResolvedValueOnce(mockSuperfoodProduct);
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({ ...createDto, color: SuperfoodColor.PURPLE })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body.color).toBe(SuperfoodColor.PURPLE);
				});
		});

		it('should create a superfood with detailSourceProduct nested object', () => {
			jest
				.spyOn(createSuperfoodProductUseCase, 'handle')
				.mockResolvedValueOnce({
					...mockSuperfoodProduct,
					detailSourceProductId: 'detail-source-123',
				});
			return request(app.getHttpServer())
				.post('/superfoods')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('detailSourceProductId');
				});
		});

		it('should return 400 when color is invalid', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({ ...createDto, color: 'INVALID_COLOR' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.post('/superfoods')
				.send({ ...createDto, status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /superfoods', () => {
		it('should get all superfood products with default pagination', async () => {
			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
			expect(Array.isArray(response.body.products)).toBe(true);
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body.pagination).toHaveProperty('page');
			expect(response.body.pagination).toHaveProperty('per_page');
		});

		it('should get superfood products with pagination', async () => {
			const paginatedResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: {
					total: 100,
					page: 2,
					per_page: 20,
				},
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(paginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?page=2&per_page=20')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
			expect(response.body.pagination.page).toBe(2);
			expect(response.body.pagination.per_page).toBe(20);
			expect(response.body.pagination.total).toBe(100);
		});

		it('should call the use case with correct pagination params', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/superfoods?page=3&per_page=15')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ page: 3, perPage: 15 });
		});

		it('should filter superfood products by price range', async () => {
			const filteredResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?min_price=20&max_price=30')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body.products).toHaveLength(1);
		});

		it('should call the use case with correct price filter params', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/superfoods?min_price=50&max_price=200')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ minPrice: 50, maxPrice: 200 });
		});

		it('should filter superfood products by category', async () => {
			const filteredResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 5, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?category_id=category-quinua-001')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
		});

		it('should call the use case with correct category filter', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/superfoods?category_id=category-quinua-001')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ categoryId: 'category-quinua-001' });
		});

		it('should filter superfood products by owner', async () => {
			const filteredResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 3, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?owner_id=shop-uuid-123')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
		});

		it('should call the use case with correct owner filter', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/superfoods?owner_id=shop-uuid-123')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ ownerId: 'shop-uuid-123' });
		});

		it('should sort superfood products by latest', async () => {
			const sortedResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(sortedResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?sort_by=latest')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
		});

		it('should sort superfood products by popular', async () => {
			const sortedResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(sortedResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods?sort_by=popular')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
		});

		it('should call the use case with correct sort_by param', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/superfoods?sort_by=popular')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ sortBy: ProductSortBy.POPULAR });
		});

		it('should filter with multiple params', async () => {
			const filteredResponse = {
				products: [mockSuperfoodProductListItem],
				pagination: { total: 2, page: 1, per_page: 10 },
			};

			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get(
					'/superfoods?category_id=category-quinua-001&min_price=20&max_price=30&owner_id=shop-123&sort_by=latest',
				)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
		});

		it('should call the use case with all filter params', async () => {
			const spy = jest.spyOn(getAllSuperfoodProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get(
					'/superfoods?page=2&per_page=15&category_id=cat-123&owner_id=owner-456&min_price=25&max_price=100&sort_by=popular',
				)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({
				page: 2,
				perPage: 15,
				categoryId: 'cat-123',
				ownerId: 'owner-456',
				minPrice: 25,
				maxPrice: 100,
				sortBy: ProductSortBy.POPULAR,
			});
		});

		it('should return products with correct structure', async () => {
			jest
				.spyOn(getAllSuperfoodProductsUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/superfoods')
				.expect(HttpStatus.OK);

			expect(response.body.products[0]).toHaveProperty('id');
			expect(response.body.products[0]).toHaveProperty('title');
			expect(response.body.products[0]).toHaveProperty('ownerName');
			expect(response.body.products[0]).toHaveProperty('price');
			expect(response.body.products[0]).toHaveProperty('totalStock');
			expect(response.body.products[0]).toHaveProperty('mainImage');
			expect(response.body.products[0]).toHaveProperty('sourceProductImage');
			expect(response.body.products[0]).toHaveProperty('nutritionItems');
			expect(response.body.products[0].mainImage).toHaveProperty('name');
			expect(response.body.products[0].mainImage).toHaveProperty('url');
			expect(response.body.products[0].sourceProductImage).toHaveProperty(
				'name',
			);
			expect(response.body.products[0].sourceProductImage).toHaveProperty(
				'url',
			);
			expect(Array.isArray(response.body.products[0].nutritionItems)).toBe(
				true,
			);
		});
	});

	describe('GET /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;

		it('should get a superfood product detail by id', () => {
			jest
				.spyOn(getByIdSuperfoodProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);
			return request(app.getHttpServer())
				.get(`/superfoods/${productId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockDetailResponse.id,
						mainImg: expect.objectContaining({
							name: expect.any(String),
							url: expect.any(String),
						}),
						plateImg: expect.objectContaining({
							name: expect.any(String),
							url: expect.any(String),
						}),
						sourceProductImg: expect.objectContaining({
							name: expect.any(String),
							url: expect.any(String),
						}),
						heroDetail: expect.objectContaining({
							title: mockDetailResponse.heroDetail.title,
							basePrice: mockDetailResponse.heroDetail.basePrice,
							totalStock: mockDetailResponse.heroDetail.totalStock,
							isDiscountActive: mockDetailResponse.heroDetail.isDiscountActive,
						}),
						owner: expect.objectContaining({
							id: expect.any(String),
							type: expect.any(String),
							name: expect.any(String),
						}),
						reviews: expect.objectContaining({
							rating: expect.objectContaining({
								totalReviews: expect.any(Number),
								averagePunctuation: expect.any(Number),
							}),
							comments: expect.any(Array),
						}),
					});
					expect(res.body).toHaveProperty('benefitsInfo');
					expect(res.body).toHaveProperty('sourceProductInfo');
					expect(res.body).toHaveProperty('strikingNutritionalItems');
					expect(res.body).toHaveProperty('nutritionalInformation');
					expect(res.body).toHaveProperty('moreProducts');
				});
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(getByIdSuperfoodProductDetailUseCase, 'handle');
			await request(app.getHttpServer())
				.get(`/superfoods/${productId}`)
				.expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(productId);
		});
	});

	describe('PUT /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;
		const updatedProduct = {
			...mockSuperfoodProduct,
			baseInfo: { ...mockBasicInfo, title: updateDto.baseInfo.title },
			priceInventory: {
				...mockPriceInventory,
				basePrice: updateDto.priceInventory.basePrice,
				totalStock: updateDto.priceInventory.totalStock,
			},
		};

		it('should update a superfood product', () => {
			jest
				.spyOn(updateSuperfoodProductUseCase, 'handle')
				.mockResolvedValueOnce(updatedProduct);
			return request(app.getHttpServer())
				.put(`/superfoods/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: productId,
						baseInfo: expect.objectContaining({
							title: updateDto.baseInfo.title,
						}),
						priceInventory: expect.objectContaining({
							basePrice: updateDto.priceInventory.basePrice,
							totalStock: updateDto.priceInventory.totalStock,
						}),
					});
				});
		});

		it('should call the use case with correct productId and dto', async () => {
			const spy = jest.spyOn(updateSuperfoodProductUseCase, 'handle');
			await request(app.getHttpServer())
				.put(`/superfoods/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(
				productId,
				expect.objectContaining({
					status: updateDto.status,
					baseInfo: expect.objectContaining({
						title: updateDto.baseInfo.title,
					}),
				}),
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
		});

		it('should return 400 when updating with invalid basePrice', () => {
			return request(app.getHttpServer())
				.put(`/superfoods/${productId}`)
				.send({
					...updateDto,
					priceInventory: { ...updateDto.priceInventory, basePrice: -10 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('DELETE /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;

		it('should delete a superfood product', () => {
			jest
				.spyOn(deleteSuperfoodProductUseCase, 'handle')
				.mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/superfoods/${productId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(deleteSuperfoodProductUseCase, 'handle');
			await request(app.getHttpServer())
				.delete(`/superfoods/${productId}`)
				.expect(HttpStatus.NO_CONTENT);
			expect(spy).toHaveBeenCalledWith(
				productId,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
		});
	});

	// ─── Ownership enforcement (PUT/DELETE) ────────────────────────────────────
	describe('ownership enforcement', () => {
		const productId = mockSuperfoodProduct.id;

		async function buildApp(
			authUser: { userId: string; email: string; roles: any[] } | null,
		): Promise<INestApplication> {
			const module: TestingModule = await Test.createTestingModule({
				controllers: [SuperfoodController],
				providers: [
					{
						provide: CreateSuperfoodProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
						},
					},
					{
						provide: GetByIdSuperfoodProductDetailUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockDetailResponse),
						},
					},
					{
						provide: GetAllSuperfoodProductsUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: UpdateSuperfoodProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
						},
					},
					{
						provide: DeleteSuperfoodProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: CreateDetailSourceProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
						},
					},
					{
						provide: UpdateDetailSourceProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
						},
					},
					{
						provide: DeleteDetailSourceProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
				],
			})
				.overrideGuard(JwtAuthGuard)
				.useValue(
					authUser ? createAllowAllGuard(authUser) : createDenyAllGuard(),
				)
				.overrideGuard(RolesGuard)
				.useValue({ canActivate: () => true })
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

		// ── PUT /superfoods/:productId ownership ──────────────────────────
		describe('PUT /superfoods/:productId', () => {
			it('should return 200 when SELLER owner updates the product', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(UpdateSuperfoodProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);

				await request(ownerApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to update', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(UpdateSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to update COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 200 when ADMIN updates any product', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(UpdateSuperfoodProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);

				await request(adminApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});

		// ── DELETE /superfoods/:productId ownership ───────────────────────
		describe('DELETE /superfoods/:productId', () => {
			it('should return 204 when SELLER owner deletes the product', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(DeleteSuperfoodProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(ownerApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.NO_CONTENT);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to delete', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(DeleteSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to delete COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 204 when ADMIN deletes any product', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(DeleteSuperfoodProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(adminApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.NO_CONTENT);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});
	});

	// ─── Pattern A/F negative-path enforcement ─────────────────────────────────
	describe('Pattern A/F negative-path enforcement', () => {
		const productId = mockSuperfoodProduct.id;

		async function buildAppWithRoles(
			authUser: { userId: string; email: string; roles: any[] } | null,
			allowRoles = true,
		): Promise<INestApplication> {
			const module: TestingModule = await Test.createTestingModule({
				controllers: [SuperfoodController],
				providers: [
					{
						provide: CreateSuperfoodProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
						},
					},
					{
						provide: GetByIdSuperfoodProductDetailUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockDetailResponse),
						},
					},
					{
						provide: GetAllSuperfoodProductsUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: UpdateSuperfoodProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
						},
					},
					{
						provide: DeleteSuperfoodProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: CreateDetailSourceProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
						},
					},
					{
						provide: UpdateDetailSourceProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }),
						},
					},
					{
						provide: DeleteDetailSourceProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
				],
			})
				.overrideGuard(JwtAuthGuard)
				.useValue(
					authUser ? createAllowAllGuard(authUser) : createDenyAllGuard(),
				)
				.overrideGuard(RolesGuard)
				.useValue({ canActivate: () => allowRoles })
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

		// ── POST /superfoods — Pattern A USER→403 ─────────────────────────
		describe('POST /superfoods', () => {
			it('should return 403 when USER tries to create a superfood', async () => {
				const userApp = await buildAppWithRoles(mockAuthUsers.customer, false);

				await request(userApp.getHttpServer())
					.post('/superfoods')
					.send(createDto)
					.expect(HttpStatus.FORBIDDEN);

				await userApp.close();
			});
		});

		// ── PUT /superfoods/:productId — Pattern F negative paths ─────────
		describe('PUT /superfoods/:productId', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/superfoods/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when superfood does not exist', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new NotFoundException('Superfood product not found'),
					);

				await request(sellerApp.getHttpServer())
					.put('/superfoods/non-existent-id')
					.send(updateDto)
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});

		// ── DELETE /superfoods/:productId — Pattern F negative paths ──────
		describe('DELETE /superfoods/:productId', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/superfoods/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when superfood does not exist', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteSuperfoodProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new NotFoundException('Superfood product not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete('/superfoods/non-existent-id')
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});
	});
});

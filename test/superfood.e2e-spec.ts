import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodController } from '../src/andean/infra/controllers/superfoodControllers/superfood.controller';
import { CreateSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetSuperfoodProductByIdUseCase } from '../src/andean/app/use_cases/superfoods/GetSuperfoodProductByIdUseCase';
import { GetSuperfoodProductsByOwnerUseCase } from '../src/andean/app/use_cases/superfoods/GetSuperfoodProductsByOwnerUseCase';
import { GetSuperfoodProductsByCategoryUseCase } from '../src/andean/app/use_cases/superfoods/GetSuperfoodProductsByCategoryUseCase';
import { UpdateSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from '../src/andean/app/use_cases/superfoods/DeleteSuperfoodProductUseCase';
import { SuperfoodProduct } from '../src/andean/domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductStatus } from '../src/andean/domain/enums/SuperfoodProductStatus';
import { SuperfoodBasicInfo } from '../src/andean/domain/entities/superfoods/SuperfoodBasicInfo';
import { SuperfoodPriceInventory } from '../src/andean/domain/entities/superfoods/SuperfoodPriceInventory';
import { SuperfoodOwnerType } from '../src/andean/domain/enums/SuperfoodOwnerType';

describe('SuperfoodController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodProductUseCase: CreateSuperfoodProductUseCase;
	let getSuperfoodProductByIdUseCase: GetSuperfoodProductByIdUseCase;
	let getSuperfoodProductsByOwnerUseCase: GetSuperfoodProductsByOwnerUseCase;
	let getSuperfoodProductsByCategoryUseCase: GetSuperfoodProductsByCategoryUseCase;
	let updateSuperfoodProductUseCase: UpdateSuperfoodProductUseCase;
	let deleteSuperfoodProductUseCase: DeleteSuperfoodProductUseCase;

	// Mock data
	const mockBasicInfo: SuperfoodBasicInfo = {
		title: 'Quinua Premium',
		mediaIds: [],
		description: 'Quinua orgánica de los Andes peruanos',
		general_features: ['Orgánica', 'Sin gluten', 'Alto en proteínas'],
		nutritional_features: [],
		benefits: [],
		ownerType: SuperfoodOwnerType.SHOP,
		ownerId: 'shop-123',
	};

	const mockPriceInventory: SuperfoodPriceInventory = {
		basePrice: 25.50,
		totalStock: 100,
		SKU: 'QUINUA-PREM-001',
	};

	const mockSuperfoodProduct: SuperfoodProduct = {
		id: 'superfood-uuid-123',
		status: SuperfoodProductStatus.PUBLISHED,
		baseInfo: mockBasicInfo,
		priceInventory: mockPriceInventory,
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
		categoryId: 'category-quinua-001',
	} as SuperfoodProduct;

	const createDto = {
		status: SuperfoodProductStatus.PUBLISHED,
		baseInfo: {
			title: 'Quinua Premium',
			mediaIds: [],
			description: 'Quinua orgánica de los Andes peruanos',
			general_features: ['Orgánica', 'Sin gluten', 'Alto en proteínas'],
			nutritional_features: [],
			benefits: [],
			ownerType: SuperfoodOwnerType.SHOP,
			ownerId: 'shop-123',
		},
		priceInventory: {
			basePrice: 25.50,
			totalStock: 100,
			SKU: 'QUINUA-PREM-001',
		},
		categoryId: 'category-quinua-001',
	};

	const updateDto = {
		status: SuperfoodProductStatus.PUBLISHED,
		baseInfo: {
			title: 'Quinua Premium Actualizada',
			mediaIds: [],
			description: 'Quinua orgánica de los Andes peruanos - Actualizada',
			general_features: ['Orgánica', 'Sin gluten', 'Alto en proteínas', 'Certificado'],
			nutritional_features: [],
			benefits: [],
			ownerType: SuperfoodOwnerType.SHOP,
			ownerId: 'shop-123',
		},
		priceInventory: {
			basePrice: 30.00,
			totalStock: 150,
			SKU: 'QUINUA-PREM-001',
		},
		categoryId: 'category-quinua-001',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		// Following TESTING_GUIDE.md: mock use cases instead of importing full module
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
					provide: GetSuperfoodProductByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockSuperfoodProduct),
					},
				},
				{
					provide: GetSuperfoodProductsByOwnerUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockSuperfoodProduct]),
					},
				},
				{
					provide: GetSuperfoodProductsByCategoryUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockSuperfoodProduct]),
					},
				},
				{
					provide: UpdateSuperfoodProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockSuperfoodProduct,
							baseInfo: { ...mockBasicInfo, title: 'Quinua Premium Actualizada' },
							priceInventory: { ...mockPriceInventory, basePrice: 30.00, totalStock: 150 },
						}),
					},
				},
				{
					provide: DeleteSuperfoodProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		// Apply global pipes for validation (like in main.ts)
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		await app.init();

		createSuperfoodProductUseCase = moduleFixture.get<CreateSuperfoodProductUseCase>(
			CreateSuperfoodProductUseCase,
		);
		getSuperfoodProductByIdUseCase = moduleFixture.get<GetSuperfoodProductByIdUseCase>(
			GetSuperfoodProductByIdUseCase,
		);
		getSuperfoodProductsByOwnerUseCase = moduleFixture.get<GetSuperfoodProductsByOwnerUseCase>(
			GetSuperfoodProductsByOwnerUseCase,
		);
		getSuperfoodProductsByCategoryUseCase = moduleFixture.get<GetSuperfoodProductsByCategoryUseCase>(
			GetSuperfoodProductsByCategoryUseCase,
		);
		updateSuperfoodProductUseCase = moduleFixture.get<UpdateSuperfoodProductUseCase>(
			UpdateSuperfoodProductUseCase,
		);
		deleteSuperfoodProductUseCase = moduleFixture.get<DeleteSuperfoodProductUseCase>(
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
			jest.spyOn(createSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('status', SuperfoodProductStatus.PUBLISHED);
					expect(res.body).toHaveProperty('baseInfo');
					expect(res.body.baseInfo).toHaveProperty('title', mockBasicInfo.title);
					expect(res.body).toHaveProperty('priceInventory');
					expect(res.body.priceInventory).toHaveProperty('basePrice', mockPriceInventory.basePrice);
					expect(res.body).toHaveProperty('categoryId');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when baseInfo.title is missing', () => {
			const invalidDto = {
				...createDto,
				baseInfo: {
					...createDto.baseInfo,
					title: undefined,
				},
			};

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when baseInfo.ownerId is missing', () => {
			const invalidDto = {
				...createDto,
				baseInfo: {
					...createDto.baseInfo,
					ownerId: undefined,
				},
			};

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basePrice is less than or equal to 0', () => {
			const invalidDto = {
				...createDto,
				priceInventory: {
					...createDto.priceInventory,
					basePrice: 0,
				},
			};

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when totalStock is negative', () => {
			const invalidDto = {
				...createDto,
				priceInventory: {
					...createDto.priceInventory,
					totalStock: -1,
				},
			};

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			const invalidDto = {
				...createDto,
				status: 'INVALID_STATUS',
			};

			return request(app.getHttpServer())
				.post('/superfoods')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /superfoods/:productId', () => {
		const productId = 'superfood-uuid-123';

		it('should get a superfood product by id', () => {
			jest.spyOn(getSuperfoodProductByIdUseCase, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);

			return request(app.getHttpServer())
				.get(`/superfoods/${productId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockSuperfoodProduct.id);
					expect(res.body).toHaveProperty('status', SuperfoodProductStatus.PUBLISHED);
					expect(res.body.baseInfo).toHaveProperty('title', mockBasicInfo.title);
					expect(res.body.priceInventory).toHaveProperty('basePrice', mockPriceInventory.basePrice);
				});
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(getSuperfoodProductByIdUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/superfoods/${productId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(productId);
		});
	});

	describe('GET /superfoods/owner/:ownerId', () => {
		const ownerId = 'shop-123';

		it('should get superfood products by owner', () => {
			jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle').mockResolvedValueOnce([mockSuperfoodProduct]);

			return request(app.getHttpServer())
				.get(`/superfoods/owner/${ownerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockSuperfoodProduct.id);
					expect(res.body[0].baseInfo).toHaveProperty('ownerId', ownerId);
				});
		});

		it('should return empty array when owner has no products', () => {
			jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get(`/superfoods/owner/${ownerId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});

		it('should call the use case with correct ownerId', async () => {
			const spy = jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/superfoods/owner/${ownerId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(ownerId);
		});
	});

	describe('GET /superfoods/category/:categoryId', () => {
		const categoryId = 'category-quinua-001';

		it('should get superfood products by category', () => {
			jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle').mockResolvedValueOnce([mockSuperfoodProduct]);

			return request(app.getHttpServer())
				.get(`/superfoods/category/${categoryId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockSuperfoodProduct.id);
					expect(res.body[0]).toHaveProperty('categoryId', categoryId);
				});
		});

		it('should return empty array when category has no products', () => {
			jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get(`/superfoods/category/${categoryId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});

		it('should call the use case with correct categoryId', async () => {
			const spy = jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/superfoods/category/${categoryId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(categoryId);
		});
	});

	describe('PATCH /superfoods/:productId', () => {
		const productId = 'superfood-uuid-123';
		const updatedProduct = {
			...mockSuperfoodProduct,
			baseInfo: { ...mockBasicInfo, title: 'Quinua Premium Actualizada' },
			priceInventory: { ...mockPriceInventory, basePrice: 30.00, totalStock: 150 },
		};

		it('should update a superfood product', () => {
			jest.spyOn(updateSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(updatedProduct);

			return request(app.getHttpServer())
				.patch(`/superfoods/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', productId);
					expect(res.body.baseInfo).toHaveProperty('title', 'Quinua Premium Actualizada');
					expect(res.body.priceInventory).toHaveProperty('basePrice', 30.00);
					expect(res.body.priceInventory).toHaveProperty('totalStock', 150);
				});
		});

		it('should call the use case with correct productId and dto', async () => {
			const spy = jest.spyOn(updateSuperfoodProductUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(`/superfoods/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(productId, expect.objectContaining({
				status: updateDto.status,
				baseInfo: expect.objectContaining({
					title: updateDto.baseInfo.title,
				}),
			}));
		});

		it('should return 400 when updating with invalid basePrice', () => {
			const invalidDto = {
				...updateDto,
				priceInventory: {
					...updateDto.priceInventory,
					basePrice: -10,
				},
			};

			return request(app.getHttpServer())
				.patch(`/superfoods/${productId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('DELETE /superfoods/:productId', () => {
		const productId = 'superfood-uuid-123';

		it('should delete a superfood product', () => {
			jest.spyOn(deleteSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfoods/${productId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(deleteSuperfoodProductUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/superfoods/${productId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(productId);
		});
	});
});

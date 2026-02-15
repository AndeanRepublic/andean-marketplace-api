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
import { CreateDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/CreateDetailSourceProductUseCase';
import { UpdateDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/UpdateDetailSourceProductUseCase';
import { DeleteDetailSourceProductUseCase } from '../src/andean/app/use_cases/detailSourceProduct/DeleteDetailSourceProductUseCase';
import { SuperfoodProduct } from '../src/andean/domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductStatus } from '../src/andean/domain/enums/SuperfoodProductStatus';
import { SuperfoodOwnerType } from '../src/andean/domain/enums/SuperfoodOwnerType';
import { SuperfoodColor } from '../src/andean/domain/enums/SuperfoodColor';
import { FixtureLoader } from './helpers/fixture-loader';

describe('SuperfoodController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodProductUseCase: CreateSuperfoodProductUseCase;
	let getSuperfoodProductByIdUseCase: GetSuperfoodProductByIdUseCase;
	let getSuperfoodProductsByOwnerUseCase: GetSuperfoodProductsByOwnerUseCase;
	let getSuperfoodProductsByCategoryUseCase: GetSuperfoodProductsByCategoryUseCase;
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

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodController],
			providers: [
				{ provide: CreateSuperfoodProductUseCase, useValue: { handle: jest.fn().mockResolvedValue(mockSuperfoodProduct) } },
				{ provide: GetSuperfoodProductByIdUseCase, useValue: { handle: jest.fn().mockResolvedValue(mockSuperfoodProduct) } },
				{ provide: GetSuperfoodProductsByOwnerUseCase, useValue: { handle: jest.fn().mockResolvedValue([mockSuperfoodProduct]) } },
				{ provide: GetSuperfoodProductsByCategoryUseCase, useValue: { handle: jest.fn().mockResolvedValue([mockSuperfoodProduct]) } },
				{
					provide: UpdateSuperfoodProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockSuperfoodProduct,
							baseInfo: { ...mockBasicInfo, title: updateDto.baseInfo.title },
							priceInventory: { ...mockPriceInventory, basePrice: updateDto.priceInventory.basePrice, totalStock: updateDto.priceInventory.totalStock },
						}),
					},
				},
				{ provide: DeleteSuperfoodProductUseCase, useValue: { handle: jest.fn().mockResolvedValue(undefined) } },
				{ provide: CreateDetailSourceProductUseCase, useValue: { handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }) } },
				{ provide: UpdateDetailSourceProductUseCase, useValue: { handle: jest.fn().mockResolvedValue({ id: 'detail-source-123' }) } },
				{ provide: DeleteDetailSourceProductUseCase, useValue: { handle: jest.fn().mockResolvedValue(undefined) } },
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
		await app.init();

		createSuperfoodProductUseCase = moduleFixture.get(CreateSuperfoodProductUseCase);
		getSuperfoodProductByIdUseCase = moduleFixture.get(GetSuperfoodProductByIdUseCase);
		getSuperfoodProductsByOwnerUseCase = moduleFixture.get(GetSuperfoodProductsByOwnerUseCase);
		createDetailSourceProductUseCase = moduleFixture.get(CreateDetailSourceProductUseCase);
		updateDetailSourceProductUseCase = moduleFixture.get(UpdateDetailSourceProductUseCase);
		deleteDetailSourceProductUseCase = moduleFixture.get(DeleteDetailSourceProductUseCase);
		getSuperfoodProductsByCategoryUseCase = moduleFixture.get(GetSuperfoodProductsByCategoryUseCase);
		updateSuperfoodProductUseCase = moduleFixture.get(UpdateSuperfoodProductUseCase);
		deleteSuperfoodProductUseCase = moduleFixture.get(DeleteSuperfoodProductUseCase);
	});

	afterAll(async () => { await app.close(); });
	afterEach(() => { jest.clearAllMocks(); });

	describe('POST /superfoods', () => {
		it('should create a new superfood product', () => {
			jest.spyOn(createSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);
			return request(app.getHttpServer())
				.post('/superfoods').send(createDto).expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						status: SuperfoodProductStatus.PUBLISHED,
						baseInfo: expect.objectContaining({ title: mockBasicInfo.title }),
						priceInventory: expect.objectContaining({ basePrice: mockPriceInventory.basePrice }),
						categoryId: expect.any(String),
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when baseInfo.title is missing', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, baseInfo: { ...createDto.baseInfo, title: undefined } })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when baseInfo.ownerId is missing', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, baseInfo: { ...createDto.baseInfo, ownerId: undefined } })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basePrice is less than or equal to 0', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, priceInventory: { ...createDto.priceInventory, basePrice: 0 } })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when totalStock is negative', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, priceInventory: { ...createDto.priceInventory, totalStock: -1 } })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create a superfood with color field', () => {
			jest.spyOn(createSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, color: SuperfoodColor.PURPLE })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body.color).toBe(SuperfoodColor.PURPLE);
				});
		});

		it('should create a superfood with detailSourceProduct nested object', () => {
			jest.spyOn(createSuperfoodProductUseCase, 'handle').mockResolvedValueOnce({
				...mockSuperfoodProduct,
				detailSourceProductId: 'detail-source-123',
			});
			return request(app.getHttpServer())
				.post('/superfoods').send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('detailSourceProductId');
				});
		});

		it('should return 400 when color is invalid', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, color: 'INVALID_COLOR' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.post('/superfoods').send({ ...createDto, status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;

		it('should get a superfood product by id', () => {
			jest.spyOn(getSuperfoodProductByIdUseCase, 'handle').mockResolvedValueOnce(mockSuperfoodProduct);
			return request(app.getHttpServer())
				.get(`/superfoods/${productId}`).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockSuperfoodProduct.id,
						status: SuperfoodProductStatus.PUBLISHED,
						baseInfo: expect.objectContaining({ title: mockBasicInfo.title }),
						priceInventory: expect.objectContaining({ basePrice: mockPriceInventory.basePrice }),
					});
				});
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(getSuperfoodProductByIdUseCase, 'handle');
			await request(app.getHttpServer()).get(`/superfoods/${productId}`).expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(productId);
		});
	});

	describe('GET /superfoods/owner/:ownerId', () => {
		const ownerId = mockBasicInfo.ownerId;

		it('should get superfood products by owner', () => {
			jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle').mockResolvedValueOnce([mockSuperfoodProduct]);
			return request(app.getHttpServer())
				.get(`/superfoods/owner/${ownerId}`).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toMatchObject({ id: mockSuperfoodProduct.id, baseInfo: expect.objectContaining({ ownerId }) });
				});
		});

		it('should return empty array when owner has no products', () => {
			jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get(`/superfoods/owner/${ownerId}`).expect(HttpStatus.OK)
				.expect((res) => { expect(res.body).toEqual([]); });
		});

		it('should call the use case with correct ownerId', async () => {
			const spy = jest.spyOn(getSuperfoodProductsByOwnerUseCase, 'handle');
			await request(app.getHttpServer()).get(`/superfoods/owner/${ownerId}`).expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(ownerId);
		});
	});

	describe('GET /superfoods/category/:categoryId', () => {
		const categoryId = mockSuperfoodProduct.categoryId;

		it('should get superfood products by category', () => {
			jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle').mockResolvedValueOnce([mockSuperfoodProduct]);
			return request(app.getHttpServer())
				.get(`/superfoods/category/${categoryId}`).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toMatchObject({ id: mockSuperfoodProduct.id, categoryId });
				});
		});

		it('should return empty array when category has no products', () => {
			jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get(`/superfoods/category/${categoryId}`).expect(HttpStatus.OK)
				.expect((res) => { expect(res.body).toEqual([]); });
		});

		it('should call the use case with correct categoryId', async () => {
			const spy = jest.spyOn(getSuperfoodProductsByCategoryUseCase, 'handle');
			await request(app.getHttpServer()).get(`/superfoods/category/${categoryId}`).expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(categoryId);
		});
	});

	describe('PATCH /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;
		const updatedProduct = {
			...mockSuperfoodProduct,
			baseInfo: { ...mockBasicInfo, title: updateDto.baseInfo.title },
			priceInventory: { ...mockPriceInventory, basePrice: updateDto.priceInventory.basePrice, totalStock: updateDto.priceInventory.totalStock },
		};

		it('should update a superfood product', () => {
			jest.spyOn(updateSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(updatedProduct);
			return request(app.getHttpServer())
				.patch(`/superfoods/${productId}`).send(updateDto).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: productId,
						baseInfo: expect.objectContaining({ title: updateDto.baseInfo.title }),
						priceInventory: expect.objectContaining({ basePrice: updateDto.priceInventory.basePrice, totalStock: updateDto.priceInventory.totalStock }),
					});
				});
		});

		it('should call the use case with correct productId and dto', async () => {
			const spy = jest.spyOn(updateSuperfoodProductUseCase, 'handle');
			await request(app.getHttpServer()).patch(`/superfoods/${productId}`).send(updateDto).expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(productId, expect.objectContaining({
				status: updateDto.status,
				baseInfo: expect.objectContaining({ title: updateDto.baseInfo.title }),
			}));
		});

		it('should return 400 when updating with invalid basePrice', () => {
			return request(app.getHttpServer())
				.patch(`/superfoods/${productId}`).send({ ...updateDto, priceInventory: { ...updateDto.priceInventory, basePrice: -10 } })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('DELETE /superfoods/:productId', () => {
		const productId = mockSuperfoodProduct.id;

		it('should delete a superfood product', () => {
			jest.spyOn(deleteSuperfoodProductUseCase, 'handle').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer()).delete(`/superfoods/${productId}`).expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(deleteSuperfoodProductUseCase, 'handle');
			await request(app.getHttpServer()).delete(`/superfoods/${productId}`).expect(HttpStatus.NO_CONTENT);
			expect(spy).toHaveBeenCalledWith(productId);
		});
	});
});

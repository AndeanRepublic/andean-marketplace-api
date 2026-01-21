import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodCategoryController } from '../src/andean/infra/controllers/superfoodControllers/superfoodCategory.controller';
import { CreateSuperfoodCategoryUseCase } from '../src/andean/app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { GetSuperfoodCategoryByIdUseCase } from '../src/andean/app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from '../src/andean/app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from '../src/andean/app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';
import { SuperfoodCategoryResponse } from '../src/andean/app/modules/SuperfoodCategoryResponse';

describe('SuperfoodCategoryController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodCategoryUseCase: CreateSuperfoodCategoryUseCase;
	let getSuperfoodCategoryByIdUseCase: GetSuperfoodCategoryByIdUseCase;
	let listSuperfoodCategoriesUseCase: ListSuperfoodCategoriesUseCase;
	let deleteSuperfoodCategoryUseCase: DeleteSuperfoodCategoryUseCase;

	// Mock data
	const mockCategoryResponse: SuperfoodCategoryResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Quinua',
		status: 'ENABLED',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Maca',
		status: 'ENABLED' as const,
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodCategoryController],
			providers: [
				{
					provide: CreateSuperfoodCategoryUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockCategoryResponse),
					},
				},
				{
					provide: GetSuperfoodCategoryByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockCategoryResponse),
					},
				},
				{
					provide: ListSuperfoodCategoriesUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockCategoryResponse]),
					},
				},
				{
					provide: DeleteSuperfoodCategoryUseCase,
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

		createSuperfoodCategoryUseCase = moduleFixture.get<CreateSuperfoodCategoryUseCase>(CreateSuperfoodCategoryUseCase);
		getSuperfoodCategoryByIdUseCase = moduleFixture.get<GetSuperfoodCategoryByIdUseCase>(GetSuperfoodCategoryByIdUseCase);
		listSuperfoodCategoriesUseCase = moduleFixture.get<ListSuperfoodCategoriesUseCase>(ListSuperfoodCategoriesUseCase);
		deleteSuperfoodCategoryUseCase = moduleFixture.get<DeleteSuperfoodCategoryUseCase>(DeleteSuperfoodCategoryUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-categories', () => {
		it('should create a new category with ENABLED status', () => {
			jest.spyOn(createSuperfoodCategoryUseCase, 'handle').mockResolvedValueOnce(mockCategoryResponse);

			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
					expect(res.body).toHaveProperty('status', 'ENABLED');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should create category with default ENABLED status when not provided', () => {
			jest.spyOn(createSuperfoodCategoryUseCase, 'handle').mockResolvedValueOnce(mockCategoryResponse);

			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: 'Cacao' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('status', 'ENABLED');
				});
		});

		it('should create category with DISABLED status', () => {
			const disabledCategory = { ...mockCategoryResponse, status: 'DISABLED' as const };
			jest.spyOn(createSuperfoodCategoryUseCase, 'handle').mockResolvedValueOnce(disabledCategory);

			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: 'Kiwicha', status: 'DISABLED' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('status', 'DISABLED');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ status: 'ENABLED' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: '', status: 'ENABLED' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: 'Test Category', status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /superfood-categories/:id', () => {
		it('should return a category by id', () => {
			jest.spyOn(getSuperfoodCategoryByIdUseCase, 'handle').mockResolvedValueOnce(mockCategoryResponse);

			return request(app.getHttpServer())
				.get(`/superfood-categories/${mockCategoryResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockCategoryResponse.id);
					expect(res.body).toHaveProperty('name', mockCategoryResponse.name);
					expect(res.body).toHaveProperty('status', mockCategoryResponse.status);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when category not found', () => {
			const error = { statusCode: 404, message: 'SuperfoodCategory with ID non-existent-id not found' };
			jest.spyOn(getSuperfoodCategoryByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-categories/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /superfood-categories', () => {
		it('should return all categories', () => {
			const mockCategories = [
				mockCategoryResponse,
				{
					...mockCategoryResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Cacao',
					status: 'ENABLED' as const,
				},
				{
					...mockCategoryResponse,
					id: '323e4567-e89b-12d3-a456-426614174002',
					name: 'Kiwicha',
					status: 'DISABLED' as const,
				},
			];
			jest.spyOn(listSuperfoodCategoriesUseCase, 'handle').mockResolvedValueOnce(mockCategories);

			return request(app.getHttpServer())
				.get('/superfood-categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(3);
					expect(res.body[0]).toHaveProperty('id');
					expect(res.body[0]).toHaveProperty('name', 'Quinua');
					expect(res.body[0]).toHaveProperty('status', 'ENABLED');
					expect(res.body[1]).toHaveProperty('name', 'Cacao');
					expect(res.body[2]).toHaveProperty('name', 'Kiwicha');
					expect(res.body[2]).toHaveProperty('status', 'DISABLED');
				});
		});

		it('should return empty array when no categories exist', () => {
			jest.spyOn(listSuperfoodCategoriesUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('DELETE /superfood-categories/:id', () => {
		it('should delete a category', () => {
			jest.spyOn(deleteSuperfoodCategoryUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-categories/${mockCategoryResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent category', () => {
			const error = { statusCode: 404, message: 'SuperfoodCategory with ID non-existent-id not found' };
			jest.spyOn(deleteSuperfoodCategoryUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-categories/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

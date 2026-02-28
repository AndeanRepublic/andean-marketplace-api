import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodCategoryController } from '../src/andean/infra/controllers/superfoodControllers/superfoodCategory.controller';
import { CreateSuperfoodCategoryUseCase } from '../src/andean/app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { GetSuperfoodCategoryByIdUseCase } from '../src/andean/app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from '../src/andean/app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from '../src/andean/app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';
import { FixtureLoader } from './helpers/fixture-loader';

describe('SuperfoodCategoryController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateSuperfoodCategoryUseCase;
	let getByIdUseCase: GetSuperfoodCategoryByIdUseCase;
	let listUseCase: ListSuperfoodCategoriesUseCase;
	let deleteUseCase: DeleteSuperfoodCategoryUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadSuperfoodCategory();
	const mockResponse = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	};
	const createDto = fixture.createDto;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodCategoryController],
			providers: [
				{
					provide: CreateSuperfoodCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
				},
				{
					provide: GetSuperfoodCategoryByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
				},
				{
					provide: ListSuperfoodCategoriesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockResponse]) },
				},
				{
					provide: DeleteSuperfoodCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
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

		createUseCase = moduleFixture.get(CreateSuperfoodCategoryUseCase);
		getByIdUseCase = moduleFixture.get(GetSuperfoodCategoryByIdUseCase);
		listUseCase = moduleFixture.get(ListSuperfoodCategoriesUseCase);
		deleteUseCase = moduleFixture.get(DeleteSuperfoodCategoryUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-categories', () => {
		it('should create a new category with ENABLED status', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockResponse);
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						name: expect.any(String),
						status: 'ENABLED',
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should create category with default ENABLED status when not provided', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockResponse);
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: 'Cacao' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({ status: 'ENABLED' });
				});
		});

		it('should create category with DISABLED status', () => {
			const disabledCategory = { ...mockResponse, status: 'DISABLED' };
			jest
				.spyOn(createUseCase, 'handle')
				.mockResolvedValueOnce(disabledCategory);
			return request(app.getHttpServer())
				.post('/superfood-categories')
				.send({ name: 'Kiwicha', status: 'DISABLED' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({ status: 'DISABLED' });
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
				.send({ name: 'Test', status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /superfood-categories/:id', () => {
		it('should return a category by id', () => {
			jest.spyOn(getByIdUseCase, 'handle').mockResolvedValueOnce(mockResponse);
			return request(app.getHttpServer())
				.get(`/superfood-categories/${mockResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockResponse.id,
						name: mockResponse.name,
						status: mockResponse.status,
					});
				});
		});

		it('should return 500 when category not found', () => {
			jest
				.spyOn(getByIdUseCase, 'handle')
				.mockRejectedValueOnce(new Error('Not found'));
			return request(app.getHttpServer())
				.get('/superfood-categories/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /superfood-categories', () => {
		it('should return all categories', () => {
			const items = [
				mockResponse,
				...fixture.additionalEntities.map((e) => ({ ...mockResponse, ...e })),
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(items);
			return request(app.getHttpServer())
				.get('/superfood-categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(items.length);
					res.body.forEach((item) => {
						expect(item).toMatchObject({
							id: expect.any(String),
							name: expect.any(String),
							status: expect.any(String),
						});
					});
				});
		});

		it('should return empty array when no categories exist', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get('/superfood-categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('DELETE /superfood-categories/:id', () => {
		it('should delete a category', () => {
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/superfood-categories/${mockResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when trying to delete non-existent category', () => {
			jest
				.spyOn(deleteUseCase, 'handle')
				.mockRejectedValueOnce(new Error('Not found'));
			return request(app.getHttpServer())
				.delete('/superfood-categories/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

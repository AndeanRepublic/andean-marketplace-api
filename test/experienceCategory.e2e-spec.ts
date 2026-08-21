import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ExperienceCategoryController } from '../src/andean/infra/controllers/experienceControllers/experienceCategory.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import { createAllowAllGuard, mockAuthUsers } from './helpers/auth-test.helper';
import { CreateExperienceCategoryUseCase } from '../src/andean/app/use_cases/experiences/category/CreateExperienceCategoryUseCase';
import { CreateManyExperienceCategoriesUseCase } from '../src/andean/app/use_cases/experiences/category/CreateManyExperienceCategoriesUseCase';
import { GetExperienceCategoryByIdUseCase } from '../src/andean/app/use_cases/experiences/category/GetExperienceCategoryByIdUseCase';
import { ListExperienceCategoriesUseCase } from '../src/andean/app/use_cases/experiences/category/ListExperienceCategoriesUseCase';
import { DeleteExperienceCategoryUseCase } from '../src/andean/app/use_cases/experiences/category/DeleteExperienceCategoryUseCase';
import { UpdateExperienceCategoryUseCase } from '../src/andean/app/use_cases/experiences/category/UpdateExperienceCategoryUseCase';
import { FixtureLoader } from './helpers/fixture-loader';

describe('ExperienceCategoryController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateExperienceCategoryUseCase;
	let createManyUseCase: CreateManyExperienceCategoriesUseCase;
	let getByIdUseCase: GetExperienceCategoryByIdUseCase;
	let listUseCase: ListExperienceCategoriesUseCase;
	let deleteUseCase: DeleteExperienceCategoryUseCase;
	let updateUseCase: UpdateExperienceCategoryUseCase;

	const fixture = FixtureLoader.loadExperienceCategory();
	const mockResponse = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	};
	const createDto = fixture.createDto;
	const bulkCreateDto = fixture.bulkCreateDto;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [ExperienceCategoryController],
			providers: [
				{
					provide: CreateExperienceCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
				},
				{
					provide: CreateManyExperienceCategoriesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockResponse]) },
				},
				{
					provide: GetExperienceCategoryByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
				},
				{
					provide: ListExperienceCategoriesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockResponse]) },
				},
				{
					provide: DeleteExperienceCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: UpdateExperienceCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
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

		createUseCase = moduleFixture.get(CreateExperienceCategoryUseCase);
		createManyUseCase = moduleFixture.get(
			CreateManyExperienceCategoriesUseCase,
		);
		getByIdUseCase = moduleFixture.get(GetExperienceCategoryByIdUseCase);
		listUseCase = moduleFixture.get(ListExperienceCategoriesUseCase);
		deleteUseCase = moduleFixture.get(DeleteExperienceCategoryUseCase);
		updateUseCase = moduleFixture.get(UpdateExperienceCategoryUseCase);
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /experiences/categories/bulk', () => {
		it('should create multiple categories in bulk', () => {
			const bulkItems = fixture.additionalEntities.map((e) => ({
				...mockResponse,
				...e,
			}));
			jest.spyOn(createManyUseCase, 'handle').mockResolvedValueOnce(bulkItems);

			return request(app.getHttpServer())
				.post('/experiences/categories/bulk')
				.send(bulkCreateDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body.length).toBeGreaterThan(0);
					res.body.forEach((item: { id: string; name: string; status: string }) => {
						expect(item).toMatchObject({
							id: expect.any(String),
							name: expect.any(String),
							status: expect.any(String),
						});
					});
				});
		});

		it('should return empty array when bulk list is empty', () => {
			jest.spyOn(createManyUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.post('/experiences/categories/bulk')
				.send({ experienceCategories: [] })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
				});
		});

		it('should return 400 when bulk body is missing the array field', () => {
			return request(app.getHttpServer())
				.post('/experiences/categories/bulk')
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('POST /experiences/categories', () => {
		it('should create a new category with ENABLED status', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockResponse);
			return request(app.getHttpServer())
				.post('/experiences/categories')
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
				.post('/experiences/categories')
				.send({ name: 'Community Tourism' })
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
				.post('/experiences/categories')
				.send({ name: 'Adventure Tourism', status: 'DISABLED' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({ status: 'DISABLED' });
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/experiences/categories')
				.send({ status: 'ENABLED' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/experiences/categories')
				.send({ name: '', status: 'ENABLED' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.post('/experiences/categories')
				.send({ name: 'Test', status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /experiences/categories/:id', () => {
		it('should return a category by id', () => {
			jest.spyOn(getByIdUseCase, 'handle').mockResolvedValueOnce(mockResponse);
			return request(app.getHttpServer())
				.get(`/experiences/categories/${mockResponse.id}`)
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
				.get('/experiences/categories/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /experiences/categories', () => {
		it('should return all categories', () => {
			const items = [
				mockResponse,
				...fixture.additionalEntities.map((e) => ({ ...mockResponse, ...e })),
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(items);
			return request(app.getHttpServer())
				.get('/experiences/categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(items.length);
					res.body.forEach((item: { id: string; name: string; status: string }) => {
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
				.get('/experiences/categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});

		it('should return multiple categories with correct names', () => {
			const items = [
				mockResponse,
				...fixture.additionalEntities.map((e) => ({ ...mockResponse, ...e })),
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(items);
			return request(app.getHttpServer())
				.get('/experiences/categories')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(items.length);
					items.forEach((item, index) => {
						expect(res.body[index].name).toBe(item.name);
					});
				});
		});
	});

	describe('PUT /experiences/categories/:id', () => {
		it('should update a category', () => {
			const updated = { ...mockResponse, name: 'Community Tourism Updated' };
			jest.spyOn(updateUseCase, 'handle').mockResolvedValueOnce(updated);
			return request(app.getHttpServer())
				.put(`/experiences/categories/${mockResponse.id}`)
				.send({ name: 'Community Tourism Updated', status: 'ENABLED' })
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockResponse.id,
						name: 'Community Tourism Updated',
					});
				});
		});
	});

	describe('DELETE /experiences/categories/:id', () => {
		it('should delete a category', () => {
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/experiences/categories/${mockResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when trying to delete non-existent category', () => {
			jest
				.spyOn(deleteUseCase, 'handle')
				.mockRejectedValueOnce(new Error('Not found'));
			return request(app.getHttpServer())
				.delete('/experiences/categories/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

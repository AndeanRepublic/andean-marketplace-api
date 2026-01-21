import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodTypeController } from '../src/andean/infra/controllers/superfoodControllers/superfoodType.controller';
import { CreateSuperfoodTypeUseCase } from '../src/andean/app/use_cases/superfoods/type/CreateSuperfoodTypeUseCase';
import { GetSuperfoodTypeByIdUseCase } from '../src/andean/app/use_cases/superfoods/type/GetSuperfoodTypeByIdUseCase';
import { ListSuperfoodTypesUseCase } from '../src/andean/app/use_cases/superfoods/type/ListSuperfoodTypesUseCase';
import { DeleteSuperfoodTypeUseCase } from '../src/andean/app/use_cases/superfoods/type/DeleteSuperfoodTypeUseCase';
import { SuperfoodTypeResponse } from '../src/andean/app/modules/SuperfoodTypeResponse';

describe('SuperfoodTypeController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateSuperfoodTypeUseCase;
	let getByIdUseCase: GetSuperfoodTypeByIdUseCase;
	let listUseCase: ListSuperfoodTypesUseCase;
	let deleteUseCase: DeleteSuperfoodTypeUseCase;

	// Mock data
	const mockType: SuperfoodTypeResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Grano',
		icon: 'https://example.com/icons/grano.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Grano',
		icon: 'https://example.com/icons/grano.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodTypeController],
			providers: [
				{
					provide: CreateSuperfoodTypeUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockType),
					},
				},
				{
					provide: GetSuperfoodTypeByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockType),
					},
				},
				{
					provide: ListSuperfoodTypesUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockType]),
					},
				},
				{
					provide: DeleteSuperfoodTypeUseCase,
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

		createUseCase = moduleFixture.get<CreateSuperfoodTypeUseCase>(CreateSuperfoodTypeUseCase);
		getByIdUseCase = moduleFixture.get<GetSuperfoodTypeByIdUseCase>(GetSuperfoodTypeByIdUseCase);
		listUseCase = moduleFixture.get<ListSuperfoodTypesUseCase>(ListSuperfoodTypesUseCase);
		deleteUseCase = moduleFixture.get<DeleteSuperfoodTypeUseCase>(DeleteSuperfoodTypeUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-types', () => {
		it('should create a new superfood type', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockType);

			return request(app.getHttpServer())
				.post('/superfood-types')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name', mockType.name);
					expect(res.body).toHaveProperty('icon', mockType.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-types')
				.send({ icon: 'https://example.com/icons/test.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is not a string', () => {
			return request(app.getHttpServer())
				.post('/superfood-types')
				.send({ name: 123 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create superfood type without icon (optional field)', () => {
			const withoutIcon = { ...mockType, icon: undefined };
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(withoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-types')
				.send({ name: 'Grano' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('name', 'Grano');
				});
		});

		it('should return 500 when superfood type name already exists', async () => {
			const error = new Error('Superfood type name already exists');
			jest.spyOn(createUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/superfood-types')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-types/:id', () => {
		it('should return a superfood type by id', () => {
			jest.spyOn(getByIdUseCase, 'handle').mockResolvedValueOnce(mockType);

			return request(app.getHttpServer())
				.get(`/superfood-types/${mockType.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockType.id);
					expect(res.body).toHaveProperty('name', mockType.name);
					expect(res.body).toHaveProperty('icon', mockType.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 500 when superfood type not found', () => {
			const error = new Error('Superfood type not found');
			jest.spyOn(getByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-types/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-types', () => {
		it('should return an array of superfood types', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([mockType]);

			return request(app.getHttpServer())
				.get('/superfood-types')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockType.id);
					expect(res.body[0]).toHaveProperty('name', mockType.name);
					expect(res.body[0]).toHaveProperty('icon', mockType.icon);
				});
		});

		it('should return an empty array when no superfood types exist', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-types')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});

		it('should return multiple superfood types', () => {
			const mockTypes = [
				mockType,
				{ ...mockType, id: 'uuid-2', name: 'Semilla' },
				{ ...mockType, id: 'uuid-3', name: 'Raíz' },
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(mockTypes);

			return request(app.getHttpServer())
				.get('/superfood-types')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(3);
					expect(res.body[0].name).toBe('Grano');
					expect(res.body[1].name).toBe('Semilla');
					expect(res.body[2].name).toBe('Raíz');
				});
		});
	});

	describe('DELETE /superfood-types/:id', () => {
		it('should delete a superfood type', () => {
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-types/${mockType.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when superfood type to delete not found', () => {
			const error = new Error('Superfood type not found');
			jest.spyOn(deleteUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-types/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

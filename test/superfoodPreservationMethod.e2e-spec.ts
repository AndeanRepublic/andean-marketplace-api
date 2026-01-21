import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodPreservationMethodController } from '../src/andean/infra/controllers/superfoodControllers/superfoodPreservationMethod.controller';
import { CreateSuperfoodPreservationMethodUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/CreateSuperfoodPreservationMethodUseCase';
import { GetSuperfoodPreservationMethodByIdUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/GetSuperfoodPreservationMethodByIdUseCase';
import { ListSuperfoodPreservationMethodsUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/ListSuperfoodPreservationMethodsUseCase';
import { DeleteSuperfoodPreservationMethodUseCase } from '../src/andean/app/use_cases/superfoods/preservationMethod/DeleteSuperfoodPreservationMethodUseCase';
import { SuperfoodPreservationMethodResponse } from '../src/andean/app/modules/SuperfoodPreservationMethodResponse';

describe('SuperfoodPreservationMethodController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodPreservationMethodUseCase: CreateSuperfoodPreservationMethodUseCase;
	let getSuperfoodPreservationMethodByIdUseCase: GetSuperfoodPreservationMethodByIdUseCase;
	let listSuperfoodPreservationMethodsUseCase: ListSuperfoodPreservationMethodsUseCase;
	let deleteSuperfoodPreservationMethodUseCase: DeleteSuperfoodPreservationMethodUseCase;

	// Mock data
	const mockPreservationMethodResponse: SuperfoodPreservationMethodResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Deshidratado',
		icon: 'https://example.com/icons/dried.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Liofilizado',
		icon: 'https://example.com/icons/freeze-dried.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodPreservationMethodController],
			providers: [
				{
					provide: CreateSuperfoodPreservationMethodUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPreservationMethodResponse),
					},
				},
				{
					provide: GetSuperfoodPreservationMethodByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPreservationMethodResponse),
					},
				},
				{
					provide: ListSuperfoodPreservationMethodsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockPreservationMethodResponse]),
					},
				},
				{
					provide: DeleteSuperfoodPreservationMethodUseCase,
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

		createSuperfoodPreservationMethodUseCase = moduleFixture.get<CreateSuperfoodPreservationMethodUseCase>(CreateSuperfoodPreservationMethodUseCase);
		getSuperfoodPreservationMethodByIdUseCase = moduleFixture.get<GetSuperfoodPreservationMethodByIdUseCase>(GetSuperfoodPreservationMethodByIdUseCase);
		listSuperfoodPreservationMethodsUseCase = moduleFixture.get<ListSuperfoodPreservationMethodsUseCase>(ListSuperfoodPreservationMethodsUseCase);
		deleteSuperfoodPreservationMethodUseCase = moduleFixture.get<DeleteSuperfoodPreservationMethodUseCase>(DeleteSuperfoodPreservationMethodUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-preservation-methods', () => {
		it('should create a new preservation method', () => {
			jest.spyOn(createSuperfoodPreservationMethodUseCase, 'handle').mockResolvedValueOnce(mockPreservationMethodResponse);

			return request(app.getHttpServer())
				.post('/superfood-preservation-methods')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
					expect(res.body).toHaveProperty('icon');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-preservation-methods')
				.send({ icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/superfood-preservation-methods')
				.send({ name: '', icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create preservation method without icon (optional field)', () => {
			const methodWithoutIcon = { ...mockPreservationMethodResponse, icon: undefined };
			jest.spyOn(createSuperfoodPreservationMethodUseCase, 'handle').mockResolvedValueOnce(methodWithoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-preservation-methods')
				.send({ name: 'Test Method' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
				});
		});
	});

	describe('GET /superfood-preservation-methods/:id', () => {
		it('should return a preservation method by id', () => {
			jest.spyOn(getSuperfoodPreservationMethodByIdUseCase, 'handle').mockResolvedValueOnce(mockPreservationMethodResponse);

			return request(app.getHttpServer())
				.get(`/superfood-preservation-methods/${mockPreservationMethodResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockPreservationMethodResponse.id);
					expect(res.body).toHaveProperty('name', mockPreservationMethodResponse.name);
					expect(res.body).toHaveProperty('icon', mockPreservationMethodResponse.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when preservation method not found', () => {
			const error = { statusCode: 404, message: 'SuperfoodPreservationMethod with ID non-existent-id not found' };
			jest.spyOn(getSuperfoodPreservationMethodByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-preservation-methods/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /superfood-preservation-methods', () => {
		it('should return all preservation methods', () => {
			const mockMethods = [
				mockPreservationMethodResponse,
				{
					...mockPreservationMethodResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Congelado',
				},
			];
			jest.spyOn(listSuperfoodPreservationMethodsUseCase, 'handle').mockResolvedValueOnce(mockMethods);

			return request(app.getHttpServer())
				.get('/superfood-preservation-methods')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(2);
					expect(res.body[0]).toHaveProperty('id');
					expect(res.body[0]).toHaveProperty('name');
					expect(res.body[1]).toHaveProperty('id');
					expect(res.body[1]).toHaveProperty('name');
				});
		});

		it('should return empty array when no preservation methods exist', () => {
			jest.spyOn(listSuperfoodPreservationMethodsUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-preservation-methods')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('DELETE /superfood-preservation-methods/:id', () => {
		it('should delete a preservation method', () => {
			jest.spyOn(deleteSuperfoodPreservationMethodUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-preservation-methods/${mockPreservationMethodResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent preservation method', () => {
			const error = { statusCode: 404, message: 'SuperfoodPreservationMethod with ID non-existent-id not found' };
			jest.spyOn(deleteSuperfoodPreservationMethodUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-preservation-methods/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodNutritionalFeatureController } from '../src/andean/infra/controllers/superfoodNutritionalFeature.controller';
import { CreateSuperfoodNutritionalFeatureUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/CreateSuperfoodNutritionalFeatureUseCase';
import { GetSuperfoodNutritionalFeatureByIdUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/GetSuperfoodNutritionalFeatureByIdUseCase';
import { ListSuperfoodNutritionalFeaturesUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/ListSuperfoodNutritionalFeaturesUseCase';
import { DeleteSuperfoodNutritionalFeatureUseCase } from '../src/andean/app/use_cases/superfoods/nutritionalFeature/DeleteSuperfoodNutritionalFeatureUseCase';
import { SuperfoodNutritionalFeatureResponse } from '../src/andean/app/modules/SuperfoodNutritionalFeatureResponse';

describe('SuperfoodNutritionalFeatureController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodNutritionalFeatureUseCase: CreateSuperfoodNutritionalFeatureUseCase;
	let getSuperfoodNutritionalFeatureByIdUseCase: GetSuperfoodNutritionalFeatureByIdUseCase;
	let listSuperfoodNutritionalFeaturesUseCase: ListSuperfoodNutritionalFeaturesUseCase;
	let deleteSuperfoodNutritionalFeatureUseCase: DeleteSuperfoodNutritionalFeatureUseCase;

	// Mock data
	const mockNutritionalFeatureResponse: SuperfoodNutritionalFeatureResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Alto en proteínas',
		icon: 'https://example.com/icons/protein.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Rico en fibra',
		icon: 'https://example.com/icons/fiber.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodNutritionalFeatureController],
			providers: [
				{
					provide: CreateSuperfoodNutritionalFeatureUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockNutritionalFeatureResponse),
					},
				},
				{
					provide: GetSuperfoodNutritionalFeatureByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockNutritionalFeatureResponse),
					},
				},
				{
					provide: ListSuperfoodNutritionalFeaturesUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockNutritionalFeatureResponse]),
					},
				},
				{
					provide: DeleteSuperfoodNutritionalFeatureUseCase,
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

		createSuperfoodNutritionalFeatureUseCase = moduleFixture.get<CreateSuperfoodNutritionalFeatureUseCase>(CreateSuperfoodNutritionalFeatureUseCase);
		getSuperfoodNutritionalFeatureByIdUseCase = moduleFixture.get<GetSuperfoodNutritionalFeatureByIdUseCase>(GetSuperfoodNutritionalFeatureByIdUseCase);
		listSuperfoodNutritionalFeaturesUseCase = moduleFixture.get<ListSuperfoodNutritionalFeaturesUseCase>(ListSuperfoodNutritionalFeaturesUseCase);
		deleteSuperfoodNutritionalFeatureUseCase = moduleFixture.get<DeleteSuperfoodNutritionalFeatureUseCase>(DeleteSuperfoodNutritionalFeatureUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-nutritional-features', () => {
		it('should create a new nutritional feature', () => {
			jest.spyOn(createSuperfoodNutritionalFeatureUseCase, 'handle').mockResolvedValueOnce(mockNutritionalFeatureResponse);

			return request(app.getHttpServer())
				.post('/superfood-nutritional-features')
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
				.post('/superfood-nutritional-features')
				.send({ icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/superfood-nutritional-features')
				.send({ name: '', icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create nutritional feature without icon (optional field)', () => {
			const featureWithoutIcon = { ...mockNutritionalFeatureResponse, icon: undefined };
			jest.spyOn(createSuperfoodNutritionalFeatureUseCase, 'handle').mockResolvedValueOnce(featureWithoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-nutritional-features')
				.send({ name: 'Test Feature' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
				});
		});
	});

	describe('GET /superfood-nutritional-features/:id', () => {
		it('should return a nutritional feature by id', () => {
			jest.spyOn(getSuperfoodNutritionalFeatureByIdUseCase, 'handle').mockResolvedValueOnce(mockNutritionalFeatureResponse);

			return request(app.getHttpServer())
				.get(`/superfood-nutritional-features/${mockNutritionalFeatureResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockNutritionalFeatureResponse.id);
					expect(res.body).toHaveProperty('name', mockNutritionalFeatureResponse.name);
					expect(res.body).toHaveProperty('icon', mockNutritionalFeatureResponse.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when nutritional feature not found', () => {
			const error = { statusCode: 404, message: 'SuperfoodNutritionalFeature with ID non-existent-id not found' };
			jest.spyOn(getSuperfoodNutritionalFeatureByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-nutritional-features/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /superfood-nutritional-features', () => {
		it('should return all nutritional features', () => {
			const mockFeatures = [
				mockNutritionalFeatureResponse,
				{
					...mockNutritionalFeatureResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Rico en antioxidantes',
				},
			];
			jest.spyOn(listSuperfoodNutritionalFeaturesUseCase, 'handle').mockResolvedValueOnce(mockFeatures);

			return request(app.getHttpServer())
				.get('/superfood-nutritional-features')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(2);
					expect(res.body[0]).toHaveProperty('id');
					expect(res.body[0]).toHaveProperty('name');
					expect(res.body[0]).toHaveProperty('icon');
					expect(res.body[1]).toHaveProperty('id');
					expect(res.body[1]).toHaveProperty('name');
				});
		});

		it('should return empty array when no nutritional features exist', () => {
			jest.spyOn(listSuperfoodNutritionalFeaturesUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-nutritional-features')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('DELETE /superfood-nutritional-features/:id', () => {
		it('should delete a nutritional feature', () => {
			jest.spyOn(deleteSuperfoodNutritionalFeatureUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-nutritional-features/${mockNutritionalFeatureResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent nutritional feature', () => {
			const error = { statusCode: 404, message: 'SuperfoodNutritionalFeature with ID non-existent-id not found' };
			jest.spyOn(deleteSuperfoodNutritionalFeatureUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-nutritional-features/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

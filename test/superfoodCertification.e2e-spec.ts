import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodCertificationController } from '../src/andean/infra/controllers/superfoodControllers/superfoodCertification.controller';
import { CreateSuperfoodCertificationUseCase } from '../src/andean/app/use_cases/superfoods/certification/CreateSuperfoodCertificationUseCase';
import { GetSuperfoodCertificationByIdUseCase } from '../src/andean/app/use_cases/superfoods/certification/GetSuperfoodCertificationByIdUseCase';
import { ListSuperfoodCertificationsUseCase } from '../src/andean/app/use_cases/superfoods/certification/ListSuperfoodCertificationsUseCase';
import { DeleteSuperfoodCertificationUseCase } from '../src/andean/app/use_cases/superfoods/certification/DeleteSuperfoodCertificationUseCase';
import { SuperfoodCertificationResponse } from '../src/andean/app/modules/SuperfoodCertificationResponse';

describe('SuperfoodCertificationController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodCertificationUseCase: CreateSuperfoodCertificationUseCase;
	let getSuperfoodCertificationByIdUseCase: GetSuperfoodCertificationByIdUseCase;
	let listSuperfoodCertificationsUseCase: ListSuperfoodCertificationsUseCase;
	let deleteSuperfoodCertificationUseCase: DeleteSuperfoodCertificationUseCase;

	// Mock data
	const mockCertificationResponse: SuperfoodCertificationResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Orgánico',
		icon: 'https://example.com/icons/organic.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Fair Trade',
		icon: 'https://example.com/icons/fairtrade.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodCertificationController],
			providers: [
				{
					provide: CreateSuperfoodCertificationUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockCertificationResponse),
					},
				},
				{
					provide: GetSuperfoodCertificationByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockCertificationResponse),
					},
				},
				{
					provide: ListSuperfoodCertificationsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockCertificationResponse]),
					},
				},
				{
					provide: DeleteSuperfoodCertificationUseCase,
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

		createSuperfoodCertificationUseCase = moduleFixture.get<CreateSuperfoodCertificationUseCase>(CreateSuperfoodCertificationUseCase);
		getSuperfoodCertificationByIdUseCase = moduleFixture.get<GetSuperfoodCertificationByIdUseCase>(GetSuperfoodCertificationByIdUseCase);
		listSuperfoodCertificationsUseCase = moduleFixture.get<ListSuperfoodCertificationsUseCase>(ListSuperfoodCertificationsUseCase);
		deleteSuperfoodCertificationUseCase = moduleFixture.get<DeleteSuperfoodCertificationUseCase>(DeleteSuperfoodCertificationUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-certifications', () => {
		it('should create a new certification', () => {
			jest.spyOn(createSuperfoodCertificationUseCase, 'handle').mockResolvedValueOnce(mockCertificationResponse);

			return request(app.getHttpServer())
				.post('/superfood-certifications')
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
				.post('/superfood-certifications')
				.send({ icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/superfood-certifications')
				.send({ name: '', icon: 'https://example.com/icon.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create certification without icon (optional field)', () => {
			const certificationWithoutIcon = { ...mockCertificationResponse, icon: undefined };
			jest.spyOn(createSuperfoodCertificationUseCase, 'handle').mockResolvedValueOnce(certificationWithoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-certifications')
				.send({ name: 'Test Certification' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
				});
		});
	});

	describe('GET /superfood-certifications/:id', () => {
		it('should return a certification by id', () => {
			jest.spyOn(getSuperfoodCertificationByIdUseCase, 'handle').mockResolvedValueOnce(mockCertificationResponse);

			return request(app.getHttpServer())
				.get(`/superfood-certifications/${mockCertificationResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockCertificationResponse.id);
					expect(res.body).toHaveProperty('name', mockCertificationResponse.name);
					expect(res.body).toHaveProperty('icon', mockCertificationResponse.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when certification not found', () => {
			const error = { statusCode: 404, message: 'SuperfoodCertification with ID non-existent-id not found' };
			jest.spyOn(getSuperfoodCertificationByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-certifications/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /superfood-certifications', () => {
		it('should return all certifications', () => {
			const mockCertifications = [
				mockCertificationResponse,
				{
					...mockCertificationResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Fair Trade',
				},
			];
			jest.spyOn(listSuperfoodCertificationsUseCase, 'handle').mockResolvedValueOnce(mockCertifications);

			return request(app.getHttpServer())
				.get('/superfood-certifications')
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

		it('should return empty array when no certifications exist', () => {
			jest.spyOn(listSuperfoodCertificationsUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-certifications')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('DELETE /superfood-certifications/:id', () => {
		it('should delete a certification', () => {
			jest.spyOn(deleteSuperfoodCertificationUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-certifications/${mockCertificationResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent certification', () => {
			const error = { statusCode: 404, message: 'SuperfoodCertification with ID non-existent-id not found' };
			jest.spyOn(deleteSuperfoodCertificationUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-certifications/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

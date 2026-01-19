import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodBenefitController } from '../src/andean/infra/controllers/superfoodBenefit.controller';
import { CreateSuperfoodBenefitUseCase } from '../src/andean/app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { GetSuperfoodBenefitByIdUseCase } from '../src/andean/app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from '../src/andean/app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from '../src/andean/app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';
import { SuperfoodBenefitResponse } from '../src/andean/app/modules/SuperfoodBenefitResponse';

describe('SuperfoodBenefitController (e2e)', () => {
	let app: INestApplication;
	let createSuperfoodBenefitUseCase: CreateSuperfoodBenefitUseCase;
	let getSuperfoodBenefitByIdUseCase: GetSuperfoodBenefitByIdUseCase;
	let listSuperfoodBenefitsUseCase: ListSuperfoodBenefitsUseCase;
	let deleteSuperfoodBenefitUseCase: DeleteSuperfoodBenefitUseCase;

	// Mock data
	const mockBenefitResponse: SuperfoodBenefitResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Mejora la digestión',
		iconId: '123e4567-e89b-12d3-a456-426614174001',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'Aumenta energía',
		iconId: '123e4567-e89b-12d3-a456-426614174002',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodBenefitController],
			providers: [
				{
					provide: CreateSuperfoodBenefitUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockBenefitResponse),
					},
				},
				{
					provide: GetSuperfoodBenefitByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockBenefitResponse),
					},
				},
				{
					provide: ListSuperfoodBenefitsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockBenefitResponse]),
					},
				},
				{
					provide: DeleteSuperfoodBenefitUseCase,
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

		createSuperfoodBenefitUseCase = moduleFixture.get<CreateSuperfoodBenefitUseCase>(CreateSuperfoodBenefitUseCase);
		getSuperfoodBenefitByIdUseCase = moduleFixture.get<GetSuperfoodBenefitByIdUseCase>(GetSuperfoodBenefitByIdUseCase);
		listSuperfoodBenefitsUseCase = moduleFixture.get<ListSuperfoodBenefitsUseCase>(ListSuperfoodBenefitsUseCase);
		deleteSuperfoodBenefitUseCase = moduleFixture.get<DeleteSuperfoodBenefitUseCase>(DeleteSuperfoodBenefitUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-benefits', () => {
		it('should create a new benefit', () => {
			jest.spyOn(createSuperfoodBenefitUseCase, 'handle').mockResolvedValueOnce(mockBenefitResponse);

			return request(app.getHttpServer())
				.post('/superfood-benefits')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
					expect(res.body).toHaveProperty('iconId');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-benefits')
				.send({ iconId: '123e4567-e89b-12d3-a456-426614174003' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is empty string', () => {
			return request(app.getHttpServer())
				.post('/superfood-benefits')
				.send({ name: '', iconId: '123e4567-e89b-12d3-a456-426614174003' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create benefit without iconId (optional field)', () => {
			const benefitWithoutIcon = { ...mockBenefitResponse, iconId: undefined };
			jest.spyOn(createSuperfoodBenefitUseCase, 'handle').mockResolvedValueOnce(benefitWithoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-benefits')
				.send({ name: 'Test Benefit' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name');
				});
		});
	});

	describe('GET /superfood-benefits/:id', () => {
		it('should return a benefit by id', () => {
			jest.spyOn(getSuperfoodBenefitByIdUseCase, 'handle').mockResolvedValueOnce(mockBenefitResponse);

			return request(app.getHttpServer())
				.get(`/superfood-benefits/${mockBenefitResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockBenefitResponse.id);
					expect(res.body).toHaveProperty('name', mockBenefitResponse.name);
					expect(res.body).toHaveProperty('iconId', mockBenefitResponse.iconId);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when benefit not found', () => {
			const error = { statusCode: 404, message: 'SuperfoodBenefit with ID non-existent-id not found' };
			jest.spyOn(getSuperfoodBenefitByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-benefits/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /superfood-benefits', () => {
		it('should return all benefits', () => {
			const mockBenefits = [
				mockBenefitResponse,
				{
					...mockBenefitResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Fortalece sistema inmune',
				},
			];
			jest.spyOn(listSuperfoodBenefitsUseCase, 'handle').mockResolvedValueOnce(mockBenefits);

			return request(app.getHttpServer())
				.get('/superfood-benefits')
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

		it('should return empty array when no benefits exist', () => {
			jest.spyOn(listSuperfoodBenefitsUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-benefits')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('DELETE /superfood-benefits/:id', () => {
		it('should delete a benefit', () => {
			jest.spyOn(deleteSuperfoodBenefitUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-benefits/${mockBenefitResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent benefit', () => {
			const error = { statusCode: 404, message: 'SuperfoodBenefit with ID non-existent-id not found' };
			jest.spyOn(deleteSuperfoodBenefitUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-benefits/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

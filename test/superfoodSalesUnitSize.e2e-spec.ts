import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodSalesUnitSizeController } from '../src/andean/infra/controllers/superfoodControllers/superfoodSalesUnitSize.controller';
import { CreateSuperfoodSalesUnitSizeUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/CreateSuperfoodSalesUnitSizeUseCase';
import { GetSuperfoodSalesUnitSizeByIdUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/GetSuperfoodSalesUnitSizeByIdUseCase';
import { ListSuperfoodSalesUnitSizesUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/ListSuperfoodSalesUnitSizesUseCase';
import { DeleteSuperfoodSalesUnitSizeUseCase } from '../src/andean/app/use_cases/superfoods/salesUnitSize/DeleteSuperfoodSalesUnitSizeUseCase';
import { SuperfoodSalesUnitSizeResponse } from '../src/andean/app/modules/SuperfoodSalesUnitSizeResponse';

describe('SuperfoodSalesUnitSizeController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateSuperfoodSalesUnitSizeUseCase;
	let getByIdUseCase: GetSuperfoodSalesUnitSizeByIdUseCase;
	let listUseCase: ListSuperfoodSalesUnitSizesUseCase;
	let deleteUseCase: DeleteSuperfoodSalesUnitSizeUseCase;

	// Mock data
	const mockSalesUnitSize: SuperfoodSalesUnitSizeResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: '500g',
		icon: 'https://example.com/icons/500g.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: '500g',
		icon: 'https://example.com/icons/500g.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodSalesUnitSizeController],
			providers: [
				{
					provide: CreateSuperfoodSalesUnitSizeUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockSalesUnitSize),
					},
				},
				{
					provide: GetSuperfoodSalesUnitSizeByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockSalesUnitSize),
					},
				},
				{
					provide: ListSuperfoodSalesUnitSizesUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockSalesUnitSize]),
					},
				},
				{
					provide: DeleteSuperfoodSalesUnitSizeUseCase,
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

		createUseCase = moduleFixture.get<CreateSuperfoodSalesUnitSizeUseCase>(CreateSuperfoodSalesUnitSizeUseCase);
		getByIdUseCase = moduleFixture.get<GetSuperfoodSalesUnitSizeByIdUseCase>(GetSuperfoodSalesUnitSizeByIdUseCase);
		listUseCase = moduleFixture.get<ListSuperfoodSalesUnitSizesUseCase>(ListSuperfoodSalesUnitSizesUseCase);
		deleteUseCase = moduleFixture.get<DeleteSuperfoodSalesUnitSizeUseCase>(DeleteSuperfoodSalesUnitSizeUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-sales-unit-sizes', () => {
		it('should create a new sales unit size', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockSalesUnitSize);

			return request(app.getHttpServer())
				.post('/superfood-sales-unit-sizes')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name', mockSalesUnitSize.name);
					expect(res.body).toHaveProperty('icon', mockSalesUnitSize.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-sales-unit-sizes')
				.send({ icon: 'https://example.com/icons/test.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is not a string', () => {
			return request(app.getHttpServer())
				.post('/superfood-sales-unit-sizes')
				.send({ name: 123 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create sales unit size without icon (optional field)', () => {
			const withoutIcon = { ...mockSalesUnitSize, icon: undefined };
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(withoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-sales-unit-sizes')
				.send({ name: '500g' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('name', '500g');
				});
		});

		it('should return 500 when sales unit size name already exists', async () => {
			const error = new Error('Sales unit size name already exists');
			jest.spyOn(createUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/superfood-sales-unit-sizes')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-sales-unit-sizes/:id', () => {
		it('should return a sales unit size by id', () => {
			jest.spyOn(getByIdUseCase, 'handle').mockResolvedValueOnce(mockSalesUnitSize);

			return request(app.getHttpServer())
				.get(`/superfood-sales-unit-sizes/${mockSalesUnitSize.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockSalesUnitSize.id);
					expect(res.body).toHaveProperty('name', mockSalesUnitSize.name);
					expect(res.body).toHaveProperty('icon', mockSalesUnitSize.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 500 when sales unit size not found', () => {
			const error = new Error('Sales unit size not found');
			jest.spyOn(getByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-sales-unit-sizes/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-sales-unit-sizes', () => {
		it('should return an array of sales unit sizes', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([mockSalesUnitSize]);

			return request(app.getHttpServer())
				.get('/superfood-sales-unit-sizes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockSalesUnitSize.id);
					expect(res.body[0]).toHaveProperty('name', mockSalesUnitSize.name);
					expect(res.body[0]).toHaveProperty('icon', mockSalesUnitSize.icon);
				});
		});

		it('should return an empty array when no sales unit sizes exist', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-sales-unit-sizes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});

		it('should return multiple sales unit sizes', () => {
			const mockSizes = [
				mockSalesUnitSize,
				{ ...mockSalesUnitSize, id: 'uuid-2', name: '1kg' },
				{ ...mockSalesUnitSize, id: 'uuid-3', name: '250g' },
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(mockSizes);

			return request(app.getHttpServer())
				.get('/superfood-sales-unit-sizes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(3);
					expect(res.body[0].name).toBe('500g');
					expect(res.body[1].name).toBe('1kg');
					expect(res.body[2].name).toBe('250g');
				});
		});
	});

	describe('DELETE /superfood-sales-unit-sizes/:id', () => {
		it('should delete a sales unit size', () => {
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-sales-unit-sizes/${mockSalesUnitSize.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when sales unit size to delete not found', () => {
			const error = new Error('Sales unit size not found');
			jest.spyOn(deleteUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-sales-unit-sizes/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

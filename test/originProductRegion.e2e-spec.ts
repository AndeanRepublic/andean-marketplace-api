import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OriginProductRegionController } from '../src/andean/infra/controllers/originProductRegion.controller';
import { CreateOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/CreateOriginProductRegionUseCase';
import { UpdateOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/UpdateOriginProductRegionUseCase';
import { GetOriginProductRegionByIdUseCase } from '../src/andean/app/use_cases/origin/GetOriginProductRegionByIdUseCase';
import { ListOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/ListOriginProductRegionUseCase';
import { DeleteOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/DeleteOriginProductRegionUseCase';
import { OriginProductRegion } from '../src/andean/domain/entities/origin/OriginProductRegion';

describe('OriginProductRegionController (e2e)', () => {
	let app: INestApplication;
	let createRegionUseCase: CreateOriginProductRegionUseCase;
	let getRegionByIdUseCase: GetOriginProductRegionByIdUseCase;
	let listRegionUseCase: ListOriginProductRegionUseCase;
	let updateRegionUseCase: UpdateOriginProductRegionUseCase;
	let deleteRegionUseCase: DeleteOriginProductRegionUseCase;

	// Mock data
	const mockRegion: OriginProductRegion = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'Test Region E2E',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	} as OriginProductRegion;

	const createDto = {
		name: 'New Region E2E',
	};

	const updateDto = {
		name: 'Updated Region E2E',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [OriginProductRegionController],
			providers: [
				{
					provide: CreateOriginProductRegionUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockRegion),
					},
				},
				{
					provide: UpdateOriginProductRegionUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue({ ...mockRegion, name: updateDto.name }),
					},
				},
				{
					provide: GetOriginProductRegionByIdUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockRegion),
					},
				},
				{
					provide: ListOriginProductRegionUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue([mockRegion]),
					},
				},
				{
					provide: DeleteOriginProductRegionUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(undefined),
					},
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

		createRegionUseCase = moduleFixture.get<CreateOriginProductRegionUseCase>(CreateOriginProductRegionUseCase);
		getRegionByIdUseCase = moduleFixture.get<GetOriginProductRegionByIdUseCase>(GetOriginProductRegionByIdUseCase);
		listRegionUseCase = moduleFixture.get<ListOriginProductRegionUseCase>(ListOriginProductRegionUseCase);
		updateRegionUseCase = moduleFixture.get<UpdateOriginProductRegionUseCase>(UpdateOriginProductRegionUseCase);
		deleteRegionUseCase = moduleFixture.get<DeleteOriginProductRegionUseCase>(DeleteOriginProductRegionUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /origin-product-regions', () => {
		it('should create a new region', () => {
			jest.spyOn(createRegionUseCase, 'execute').mockResolvedValueOnce(mockRegion);

			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name', mockRegion.name);
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name already exists', async () => {
			const error = new Error('Region name already exists');
			jest.spyOn(createRegionUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /origin-product-regions/:id', () => {
		it('should return a region by id', () => {
			jest.spyOn(getRegionByIdUseCase, 'execute').mockResolvedValueOnce(mockRegion);

			return request(app.getHttpServer())
				.get(`/origin-product-regions/${mockRegion.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockRegion.id);
					expect(res.body).toHaveProperty('name', mockRegion.name);
				});
		});

		it('should return 404 when region not found', () => {
			const error = new Error('Region not found');
			jest.spyOn(getRegionByIdUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/origin-product-regions/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /origin-product-regions', () => {
		it('should return an array of regions', () => {
			jest.spyOn(listRegionUseCase, 'execute').mockResolvedValueOnce([mockRegion]);

			return request(app.getHttpServer())
				.get('/origin-product-regions')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockRegion.id);
					expect(res.body[0]).toHaveProperty('name', mockRegion.name);
				});
		});

		it('should return an empty array when no regions exist', () => {
			jest.spyOn(listRegionUseCase, 'execute').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/origin-product-regions')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('PUT /origin-product-regions/:id', () => {
		it('should update a region', () => {
			const updated = { ...mockRegion, name: updateDto.name, updatedAt: new Date('2026-01-14') } as OriginProductRegion;
			jest.spyOn(updateRegionUseCase, 'execute').mockResolvedValueOnce(updated);

			return request(app.getHttpServer())
				.put(`/origin-product-regions/${mockRegion.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockRegion.id);
					expect(res.body).toHaveProperty('name', updateDto.name);
				});
		});

		it('should return 404 when region to update not found', () => {
			const error = new Error('Region not found');
			jest.spyOn(updateRegionUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.put('/origin-product-regions/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it('should return 400 when updated name already exists', () => {
			const error = new Error('Region name already exists');
			jest.spyOn(updateRegionUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.put(`/origin-product-regions/${mockRegion.id}`)
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('DELETE /origin-product-regions/:id', () => {
		it('should delete a region', () => {
			jest.spyOn(deleteRegionUseCase, 'execute').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/origin-product-regions/${mockRegion.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when region to delete not found', () => {
			const error = new Error('Region not found');
			jest.spyOn(deleteRegionUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/origin-product-regions/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

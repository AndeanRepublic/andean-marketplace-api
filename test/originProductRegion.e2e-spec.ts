import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OriginProductRegionController } from '../src/andean/infra/controllers/originProductRegion.controller';
import { CreateOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/CreateOriginProductRegionUseCase';
import { CreateManyOriginProductRegionsUseCase } from '../src/andean/app/use_cases/origin/CreateManyOriginProductRegionsUseCase';
import { UpdateOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/UpdateOriginProductRegionUseCase';
import { GetOriginProductRegionByIdUseCase } from '../src/andean/app/use_cases/origin/GetOriginProductRegionByIdUseCase';
import { ListOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/ListOriginProductRegionUseCase';
import { DeleteOriginProductRegionUseCase } from '../src/andean/app/use_cases/origin/DeleteOriginProductRegionUseCase';
import { OriginProductRegion } from '../src/andean/domain/entities/origin/OriginProductRegion';
import { FixtureLoader } from './helpers/fixture-loader';

describe('OriginProductRegionController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateOriginProductRegionUseCase;
	let getByIdUseCase: GetOriginProductRegionByIdUseCase;
	let listUseCase: ListOriginProductRegionUseCase;
	let updateUseCase: UpdateOriginProductRegionUseCase;
	let deleteUseCase: DeleteOriginProductRegionUseCase;

	const fixture = FixtureLoader.loadOriginProductRegion();
	const mockRegion = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as OriginProductRegion;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [OriginProductRegionController],
			providers: [
				{
					provide: CreateOriginProductRegionUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockRegion) },
				},
				{
					provide: CreateManyOriginProductRegionsUseCase,
					useValue: { execute: jest.fn().mockResolvedValue([mockRegion]) },
				},
				{
					provide: UpdateOriginProductRegionUseCase,
					useValue: {
						execute: jest
							.fn()
							.mockResolvedValue({ ...mockRegion, name: updateDto.name }),
					},
				},
				{
					provide: GetOriginProductRegionByIdUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockRegion) },
				},
				{
					provide: ListOriginProductRegionUseCase,
					useValue: { execute: jest.fn().mockResolvedValue([mockRegion]) },
				},
				{
					provide: DeleteOriginProductRegionUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(undefined) },
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

		createUseCase = moduleFixture.get(CreateOriginProductRegionUseCase);
		getByIdUseCase = moduleFixture.get(GetOriginProductRegionByIdUseCase);
		listUseCase = moduleFixture.get(ListOriginProductRegionUseCase);
		updateUseCase = moduleFixture.get(UpdateOriginProductRegionUseCase);
		deleteUseCase = moduleFixture.get(DeleteOriginProductRegionUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /origin-product-regions', () => {
		it('should create a new region', () => {
			jest.spyOn(createUseCase, 'execute').mockResolvedValueOnce(mockRegion);
			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						name: mockRegion.name,
					});
				});
		});
		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});
		it('should return 500 when name already exists', () => {
			jest
				.spyOn(createUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Region name already exists'));
			return request(app.getHttpServer())
				.post('/origin-product-regions')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /origin-product-regions/:id', () => {
		it('should return a region by id', () => {
			jest.spyOn(getByIdUseCase, 'execute').mockResolvedValueOnce(mockRegion);
			return request(app.getHttpServer())
				.get(`/origin-product-regions/${mockRegion.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockRegion.id,
						name: mockRegion.name,
					});
				});
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(getByIdUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Region not found'));
			return request(app.getHttpServer())
				.get('/origin-product-regions/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /origin-product-regions', () => {
		it('should return an array of regions', () => {
			jest.spyOn(listUseCase, 'execute').mockResolvedValueOnce([mockRegion]);
			return request(app.getHttpServer())
				.get('/origin-product-regions')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toMatchObject({
						id: mockRegion.id,
						name: mockRegion.name,
					});
				});
		});
		it('should return empty array when no regions exist', () => {
			jest.spyOn(listUseCase, 'execute').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get('/origin-product-regions')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('PUT /origin-product-regions/:id', () => {
		it('should update a region', () => {
			const updated = {
				...mockRegion,
				name: updateDto.name,
			} as OriginProductRegion;
			jest.spyOn(updateUseCase, 'execute').mockResolvedValueOnce(updated);
			return request(app.getHttpServer())
				.put(`/origin-product-regions/${mockRegion.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockRegion.id,
						name: updateDto.name,
					});
				});
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(updateUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Region not found'));
			return request(app.getHttpServer())
				.put('/origin-product-regions/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('DELETE /origin-product-regions/:id', () => {
		it('should delete a region', () => {
			jest.spyOn(deleteUseCase, 'execute').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/origin-product-regions/${mockRegion.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(deleteUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Region not found'));
			return request(app.getHttpServer())
				.delete('/origin-product-regions/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

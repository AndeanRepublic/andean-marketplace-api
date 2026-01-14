import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OriginProductCommunityController } from '../src/andean/infra/controllers/originProductCommunity.controller';
import { CreateOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/CreateOriginProductCommunityUseCase';
import { UpdateOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/UpdateOriginProductCommunityUseCase';
import { GetOriginProductCommunityByIdUseCase } from '../src/andean/app/use_cases/origin/GetOriginProductCommunityByIdUseCase';
import { ListOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/ListOriginProductCommunityUseCase';
import { DeleteOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/DeleteOriginProductCommunityUseCase';
import { OriginProductCommunity } from '../src/andean/domain/entities/origin/OriginProductCommunity';

describe('OriginProductCommunityController (e2e)', () => {
	let app: INestApplication;
	let createCommunityUseCase: CreateOriginProductCommunityUseCase;
	let getCommunityByIdUseCase: GetOriginProductCommunityByIdUseCase;
	let listCommunityUseCase: ListOriginProductCommunityUseCase;
	let updateCommunityUseCase: UpdateOriginProductCommunityUseCase;
	let deleteCommunityUseCase: DeleteOriginProductCommunityUseCase;

	// Mock data
	const mockRegionId = '123e4567-e89b-12d3-a456-426614174000';
	const mockCommunity: OriginProductCommunity = {
		id: '456e7890-e89b-12d3-a456-426614174001',
		name: 'Test Community E2E',
		regionId: mockRegionId,
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	} as OriginProductCommunity;

	const createDto = {
		name: 'New Community E2E',
		regionId: mockRegionId,
	};

	const updateDto = {
		name: 'Updated Community E2E',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [OriginProductCommunityController],
			providers: [
				{
					provide: CreateOriginProductCommunityUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockCommunity),
					},
				},
				{
					provide: UpdateOriginProductCommunityUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue({ ...mockCommunity, name: updateDto.name }),
					},
				},
				{
					provide: GetOriginProductCommunityByIdUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockCommunity),
					},
				},
				{
					provide: ListOriginProductCommunityUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue([mockCommunity]),
					},
				},
				{
					provide: DeleteOriginProductCommunityUseCase,
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

		createCommunityUseCase = moduleFixture.get<CreateOriginProductCommunityUseCase>(CreateOriginProductCommunityUseCase);
		getCommunityByIdUseCase = moduleFixture.get<GetOriginProductCommunityByIdUseCase>(GetOriginProductCommunityByIdUseCase);
		listCommunityUseCase = moduleFixture.get<ListOriginProductCommunityUseCase>(ListOriginProductCommunityUseCase);
		updateCommunityUseCase = moduleFixture.get<UpdateOriginProductCommunityUseCase>(UpdateOriginProductCommunityUseCase);
		deleteCommunityUseCase = moduleFixture.get<DeleteOriginProductCommunityUseCase>(DeleteOriginProductCommunityUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /origin-product-communities', () => {
		it('should create a new community', () => {
			jest.spyOn(createCommunityUseCase, 'execute').mockResolvedValueOnce(mockCommunity);

			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name', mockCommunity.name);
					expect(res.body).toHaveProperty('regionId', mockRegionId);
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send({ regionId: mockRegionId })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when regionId is missing', () => {
			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send({ name: 'Test' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name already exists', async () => {
			const error = new Error('Community name already exists');
			jest.spyOn(createCommunityUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it('should return 404 when region not found', async () => {
			const error = new Error('Region not found');
			jest.spyOn(createCommunityUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /origin-product-communities/:id', () => {
		it('should return a community by id', () => {
			jest.spyOn(getCommunityByIdUseCase, 'execute').mockResolvedValueOnce(mockCommunity);

			return request(app.getHttpServer())
				.get(`/origin-product-communities/${mockCommunity.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockCommunity.id);
					expect(res.body).toHaveProperty('name', mockCommunity.name);
					expect(res.body).toHaveProperty('regionId', mockRegionId);
				});
		});

		it('should return 404 when community not found', () => {
			const error = new Error('Community not found');
			jest.spyOn(getCommunityByIdUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/origin-product-communities/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /origin-product-communities', () => {
		it('should return an array of communities', () => {
			jest.spyOn(listCommunityUseCase, 'execute').mockResolvedValueOnce([mockCommunity]);

			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockCommunity.id);
					expect(res.body[0]).toHaveProperty('name', mockCommunity.name);
					expect(res.body[0]).toHaveProperty('regionId', mockRegionId);
				});
		});

		it('should return filtered communities by regionId', () => {
			jest.spyOn(listCommunityUseCase, 'execute').mockResolvedValueOnce([mockCommunity]);

			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.query({ regionId: mockRegionId })
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('regionId', mockRegionId);
				});
		});

		it('should return an empty array when no communities exist', () => {
			jest.spyOn(listCommunityUseCase, 'execute').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('PUT /origin-product-communities/:id', () => {
		it('should update a community', () => {
			const updated = { ...mockCommunity, name: updateDto.name, updatedAt: new Date('2026-01-14') } as OriginProductCommunity;
			jest.spyOn(updateCommunityUseCase, 'execute').mockResolvedValueOnce(updated);

			return request(app.getHttpServer())
				.put(`/origin-product-communities/${mockCommunity.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockCommunity.id);
					expect(res.body).toHaveProperty('name', updateDto.name);
					expect(res.body).toHaveProperty('regionId', mockRegionId);
				});
		});

		it('should return 404 when community to update not found', () => {
			const error = new Error('Community not found');
			jest.spyOn(updateCommunityUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.put('/origin-product-communities/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it('should return 400 when updated name already exists', () => {
			const error = new Error('Community name already exists');
			jest.spyOn(updateCommunityUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.put(`/origin-product-communities/${mockCommunity.id}`)
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('DELETE /origin-product-communities/:id', () => {
		it('should delete a community', () => {
			jest.spyOn(deleteCommunityUseCase, 'execute').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/origin-product-communities/${mockCommunity.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when community to delete not found', () => {
			const error = new Error('Community not found');
			jest.spyOn(deleteCommunityUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/origin-product-communities/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

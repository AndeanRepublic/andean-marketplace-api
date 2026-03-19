import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { OriginProductCommunityController } from '../src/andean/infra/controllers/originProductCommunity.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import { createAllowAllGuard, mockAuthUsers } from './helpers/auth-test.helper';
import { CreateOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/CreateOriginProductCommunityUseCase';
import { UpdateOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/UpdateOriginProductCommunityUseCase';
import { GetOriginProductCommunityByIdUseCase } from '../src/andean/app/use_cases/origin/GetOriginProductCommunityByIdUseCase';
import { ListOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/ListOriginProductCommunityUseCase';
import { DeleteOriginProductCommunityUseCase } from '../src/andean/app/use_cases/origin/DeleteOriginProductCommunityUseCase';
import { CreateManyOriginProductCommunitiesUseCase } from '../src/andean/app/use_cases/origin/CreateManyOriginProductCommunitiesUseCase';
import { OriginProductCommunity } from '../src/andean/domain/entities/origin/OriginProductCommunity';
import { FixtureLoader } from './helpers/fixture-loader';

describe('OriginProductCommunityController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateOriginProductCommunityUseCase;
	let getByIdUseCase: GetOriginProductCommunityByIdUseCase;
	let listUseCase: ListOriginProductCommunityUseCase;
	let updateUseCase: UpdateOriginProductCommunityUseCase;
	let deleteUseCase: DeleteOriginProductCommunityUseCase;

	const fixture = FixtureLoader.loadOriginProductCommunity();
	const mockCommunity = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as OriginProductCommunity;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;
	const mockRegionId = fixture.entity.regionId;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [OriginProductCommunityController],
			providers: [
				{
					provide: CreateOriginProductCommunityUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockCommunity) },
				},
				{
					provide: CreateManyOriginProductCommunitiesUseCase,
					useValue: { execute: jest.fn().mockResolvedValue([mockCommunity]) },
				},
				{
					provide: UpdateOriginProductCommunityUseCase,
					useValue: {
						execute: jest
							.fn()
							.mockResolvedValue({ ...mockCommunity, name: updateDto.name }),
					},
				},
				{
					provide: GetOriginProductCommunityByIdUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockCommunity) },
				},
				{
					provide: ListOriginProductCommunityUseCase,
					useValue: { execute: jest.fn().mockResolvedValue([mockCommunity]) },
				},
				{
					provide: DeleteOriginProductCommunityUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(undefined) },
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

		createUseCase = moduleFixture.get(CreateOriginProductCommunityUseCase);
		getByIdUseCase = moduleFixture.get(GetOriginProductCommunityByIdUseCase);
		listUseCase = moduleFixture.get(ListOriginProductCommunityUseCase);
		updateUseCase = moduleFixture.get(UpdateOriginProductCommunityUseCase);
		deleteUseCase = moduleFixture.get(DeleteOriginProductCommunityUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /origin-product-communities', () => {
		it('should create a new community', () => {
			jest.spyOn(createUseCase, 'execute').mockResolvedValueOnce(mockCommunity);
			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						name: mockCommunity.name,
						regionId: mockRegionId,
					});
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
		it('should return 500 when name already exists', () => {
			jest
				.spyOn(createUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Community name already exists'));
			return request(app.getHttpServer())
				.post('/origin-product-communities')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /origin-product-communities/:id', () => {
		it('should return a community by id', () => {
			jest
				.spyOn(getByIdUseCase, 'execute')
				.mockResolvedValueOnce(mockCommunity);
			return request(app.getHttpServer())
				.get(`/origin-product-communities/${mockCommunity.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockCommunity.id,
						name: mockCommunity.name,
						regionId: mockRegionId,
					});
				});
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(getByIdUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer())
				.get('/origin-product-communities/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /origin-product-communities', () => {
		it('should return an array of communities', () => {
			jest.spyOn(listUseCase, 'execute').mockResolvedValueOnce([mockCommunity]);
			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toMatchObject({
						id: mockCommunity.id,
						name: mockCommunity.name,
						regionId: mockRegionId,
					});
				});
		});
		it('should return filtered communities by regionId', () => {
			jest.spyOn(listUseCase, 'execute').mockResolvedValueOnce([mockCommunity]);
			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.query({ regionId: mockRegionId })
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body[0]).toMatchObject({ regionId: mockRegionId });
				});
		});
		it('should return empty array when no communities exist', () => {
			jest.spyOn(listUseCase, 'execute').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get('/origin-product-communities')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('PUT /origin-product-communities/:id', () => {
		it('should update a community', () => {
			const updated = {
				...mockCommunity,
				name: updateDto.name,
			} as OriginProductCommunity;
			jest.spyOn(updateUseCase, 'execute').mockResolvedValueOnce(updated);
			return request(app.getHttpServer())
				.put(`/origin-product-communities/${mockCommunity.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockCommunity.id,
						name: updateDto.name,
					});
				});
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(updateUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer())
				.put('/origin-product-communities/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('DELETE /origin-product-communities/:id', () => {
		it('should delete a community', () => {
			jest.spyOn(deleteUseCase, 'execute').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/origin-product-communities/${mockCommunity.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});
		it('should return 500 when not found', () => {
			jest
				.spyOn(deleteUseCase, 'execute')
				.mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer())
				.delete('/origin-product-communities/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

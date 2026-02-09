import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { CommunityController } from '../src/andean/infra/controllers/community.controller';
import { CreateCommunityUseCase } from '../src/andean/app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from '../src/andean/app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from '../src/andean/app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from '../src/andean/app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from '../src/andean/app/use_cases/community/DeleteCommunityUseCase';
import { CreateSealUseCase } from '../src/andean/app/use_cases/community/CreateSealUseCase';
import { GetAllSealsUseCase } from '../src/andean/app/use_cases/community/GetAllSealsUseCase';
import { GetByIdSealUseCase } from '../src/andean/app/use_cases/community/GetByIdSealUseCase';
import { UpdateSealUseCase } from '../src/andean/app/use_cases/community/UpdateSealUseCase';
import { DeleteSealUseCase } from '../src/andean/app/use_cases/community/DeleteSealUseCase';
import { Community } from '../src/andean/domain/entities/community/Community';
import { FixtureLoader } from './helpers/fixture-loader';

describe('CommunityController (e2e)', () => {
	let app: INestApplication;
	let createCommunityUseCase: CreateCommunityUseCase;
	let getCommunityByIdUseCase: GetCommunityByIdUseCase;
	let listCommunityUseCase: ListCommunityUseCase;
	let updateCommunityUseCase: UpdateCommunityUseCase;
	let deleteCommunityUseCase: DeleteCommunityUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadCommunity();
	const mockCommunity = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as Community;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [CommunityController],
			providers: [
				{ provide: CreateCommunityUseCase, useValue: { execute: jest.fn().mockResolvedValue(mockCommunity) } },
				{ provide: UpdateCommunityUseCase, useValue: { execute: jest.fn().mockResolvedValue({ ...mockCommunity, name: updateDto.name }) } },
				{ provide: GetCommunityByIdUseCase, useValue: { execute: jest.fn().mockResolvedValue(mockCommunity) } },
				{ provide: ListCommunityUseCase, useValue: { execute: jest.fn().mockResolvedValue([mockCommunity]) } },
				{ provide: DeleteCommunityUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
				{ provide: CreateSealUseCase, useValue: { handle: jest.fn().mockResolvedValue(fixture.seal) } },
				{ provide: GetAllSealsUseCase, useValue: { handle: jest.fn().mockResolvedValue([]) } },
				{ provide: GetByIdSealUseCase, useValue: { handle: jest.fn().mockResolvedValue(fixture.seal) } },
				{ provide: UpdateSealUseCase, useValue: { handle: jest.fn().mockResolvedValue(fixture.sealUpdated) } },
				{ provide: DeleteSealUseCase, useValue: { handle: jest.fn().mockResolvedValue(undefined) } },
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
		await app.init();

		createCommunityUseCase = moduleFixture.get(CreateCommunityUseCase);
		getCommunityByIdUseCase = moduleFixture.get(GetCommunityByIdUseCase);
		listCommunityUseCase = moduleFixture.get(ListCommunityUseCase);
		updateCommunityUseCase = moduleFixture.get(UpdateCommunityUseCase);
		deleteCommunityUseCase = moduleFixture.get(DeleteCommunityUseCase);
	});

	afterAll(async () => { await app.close(); });
	afterEach(() => { jest.clearAllMocks(); });

	describe('POST /communities', () => {
		it('should create a new community', () => {
			jest.spyOn(createCommunityUseCase, 'execute').mockResolvedValueOnce(mockCommunity);
			return request(app.getHttpServer())
				.post('/communities').send(createDto).expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({ id: mockCommunity.id, name: mockCommunity.name });
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer()).post('/communities').send({}).expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name already exists', async () => {
			jest.spyOn(createCommunityUseCase, 'execute').mockRejectedValueOnce(new BadRequestException('Community name already exists'));
			return request(app.getHttpServer()).post('/communities').send(createDto).expect(HttpStatus.BAD_REQUEST);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /communities/:id', () => {
		it('should return a community by id', () => {
			jest.spyOn(getCommunityByIdUseCase, 'execute').mockResolvedValueOnce(mockCommunity);
			return request(app.getHttpServer())
				.get(`/communities/${mockCommunity.id}`).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({ id: mockCommunity.id, name: mockCommunity.name });
				});
		});

		it('should return 500 when community not found', () => {
			jest.spyOn(getCommunityByIdUseCase, 'execute').mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer()).get('/communities/non-existent-id').expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('GET /communities', () => {
		it('should return an array of communities', () => {
			jest.spyOn(listCommunityUseCase, 'execute').mockResolvedValueOnce([mockCommunity]);
			return request(app.getHttpServer()).get('/communities').expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toMatchObject({ id: mockCommunity.id, name: mockCommunity.name });
				});
		});

		it('should return an empty array when no communities exist', () => {
			jest.spyOn(listCommunityUseCase, 'execute').mockResolvedValueOnce([]);
			return request(app.getHttpServer()).get('/communities').expect(HttpStatus.OK)
				.expect((res) => { expect(res.body).toEqual([]); });
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('PUT /communities/:id', () => {
		it('should update a community', () => {
			const updated = { ...mockCommunity, name: updateDto.name, updatedAt: new Date('2026-01-14') } as Community;
			jest.spyOn(updateCommunityUseCase, 'execute').mockResolvedValueOnce(updated);
			return request(app.getHttpServer())
				.put(`/communities/${mockCommunity.id}`).send(updateDto).expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({ id: mockCommunity.id, name: updateDto.name });
				});
		});

		it('should return 500 when community to update not found', () => {
			jest.spyOn(updateCommunityUseCase, 'execute').mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer()).put('/communities/non-existent-id').send(updateDto).expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it('should return 500 when updated name already exists', () => {
			jest.spyOn(updateCommunityUseCase, 'execute').mockRejectedValueOnce(new Error('Community name already exists'));
			return request(app.getHttpServer()).put(`/communities/${mockCommunity.id}`).send(updateDto).expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	// SKIPPED: Route commented out in controller (only POST is active)
	describe.skip('DELETE /communities/:id', () => {
		it('should delete a community', () => {
			jest.spyOn(deleteCommunityUseCase, 'execute').mockResolvedValueOnce(undefined);
			return request(app.getHttpServer()).delete(`/communities/${mockCommunity.id}`).expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when community to delete not found', () => {
			jest.spyOn(deleteCommunityUseCase, 'execute').mockRejectedValueOnce(new Error('Community not found'));
			return request(app.getHttpServer()).delete('/communities/non-existent-id').expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

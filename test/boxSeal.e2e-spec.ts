import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FixtureLoader } from './helpers/fixture-loader';

// ─── Controller ─────────────────────────────────────────────────────────────
import { BoxSealController } from '../src/andean/infra/controllers/box/boxSeal.controller';

// ─── Use Cases ──────────────────────────────────────────────────────────────
import { CreateBoxSealUseCase } from '../src/andean/app/use_cases/boxSeals/CreateBoxSealUseCase';
import { CreateManyBoxSealsUseCase } from '../src/andean/app/use_cases/boxSeals/CreateManyBoxSealsUseCase';
import { GetAllBoxSealsUseCase } from '../src/andean/app/use_cases/boxSeals/GetAllBoxSealsUseCase';
import { GetBoxSealByIdUseCase } from '../src/andean/app/use_cases/boxSeals/GetBoxSealByIdUseCase';
import { UpdateBoxSealUseCase } from '../src/andean/app/use_cases/boxSeals/UpdateBoxSealUseCase';
import { DeleteBoxSealUseCase } from '../src/andean/app/use_cases/boxSeals/DeleteBoxSealUseCase';

// ─── Domain ─────────────────────────────────────────────────────────────────
import { BoxSeal } from '../src/andean/domain/entities/box/BoxSeal';

describe('BoxSealController (e2e)', () => {
	let app: INestApplication;
	let createBoxSealUseCase: CreateBoxSealUseCase;
	let createManyBoxSealsUseCase: CreateManyBoxSealsUseCase;
	let getAllBoxSealsUseCase: GetAllBoxSealsUseCase;
	let getBoxSealByIdUseCase: GetBoxSealByIdUseCase;
	let updateBoxSealUseCase: UpdateBoxSealUseCase;
	let deleteBoxSealUseCase: DeleteBoxSealUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadBoxSeal();
	const mockBoxSeal = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as BoxSeal;
	const createDto = fixture.createDto;
	const bulkCreateDto = fixture.bulkCreateDto;
	const updateDto = fixture.updateDto;
	const additionalEntities = fixture.additionalEntities;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [BoxSealController],
			providers: [
				{
					provide: CreateBoxSealUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBoxSeal) },
				},
				{
					provide: CreateManyBoxSealsUseCase,
					useValue: {
						handle: jest
							.fn()
							.mockResolvedValue([mockBoxSeal, ...additionalEntities]),
					},
				},
				{
					provide: GetAllBoxSealsUseCase,
					useValue: {
						handle: jest
							.fn()
							.mockResolvedValue([mockBoxSeal, ...additionalEntities]),
					},
				},
				{
					provide: GetBoxSealByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBoxSeal) },
				},
				{
					provide: UpdateBoxSealUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockBoxSeal,
							name: updateDto.name,
							description: updateDto.description,
						}),
					},
				},
				{
					provide: DeleteBoxSealUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
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

		createBoxSealUseCase = moduleFixture.get(CreateBoxSealUseCase);
		createManyBoxSealsUseCase = moduleFixture.get(CreateManyBoxSealsUseCase);
		getAllBoxSealsUseCase = moduleFixture.get(GetAllBoxSealsUseCase);
		getBoxSealByIdUseCase = moduleFixture.get(GetBoxSealByIdUseCase);
		updateBoxSealUseCase = moduleFixture.get(UpdateBoxSealUseCase);
		deleteBoxSealUseCase = moduleFixture.get(DeleteBoxSealUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /box-seals  —  Create a new BoxSeal
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /box-seals', () => {
		it('should create a new box seal', () => {
			jest
				.spyOn(createBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(mockBoxSeal);
			return request(app.getHttpServer())
				.post('/box-seals')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						name: mockBoxSeal.name,
						description: mockBoxSeal.description,
						logoMediaId: mockBoxSeal.logoMediaId,
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should call the use case with the correct DTO', async () => {
			jest
				.spyOn(createBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(mockBoxSeal);
			await request(app.getHttpServer())
				.post('/box-seals')
				.send(createDto)
				.expect(HttpStatus.CREATED);
			expect(createBoxSealUseCase.handle).toHaveBeenCalledWith(
				expect.objectContaining({
					name: createDto.name,
					description: createDto.description,
					logoMediaId: createDto.logoMediaId,
				}),
			);
		});

		it('should return 400 when name is missing', () => {
			const { name, ...dtoWithoutName } = createDto;
			return request(app.getHttpServer())
				.post('/box-seals')
				.send(dtoWithoutName)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when description is missing', () => {
			const { description, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/box-seals')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when logoMediaId is missing', () => {
			const { logoMediaId, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/box-seals')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /box-seals/bulk  —  Bulk create BoxSeals
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /box-seals/bulk', () => {
		it('should create multiple box seals', () => {
			const mockMany = [mockBoxSeal, ...additionalEntities];
			jest
				.spyOn(createManyBoxSealsUseCase, 'handle')
				.mockResolvedValueOnce(mockMany as BoxSeal[]);
			return request(app.getHttpServer())
				.post('/box-seals/bulk')
				.send(bulkCreateDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(mockMany.length);
					expect(res.body[0]).toMatchObject({ name: mockBoxSeal.name });
				});
		});

		it('should return 400 when boxSeals array is empty', () => {
			return request(app.getHttpServer())
				.post('/box-seals/bulk')
				.send({ boxSeals: [] })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when boxSeals field is missing', () => {
			return request(app.getHttpServer())
				.post('/box-seals/bulk')
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /box-seals  —  List all BoxSeals
	// ═══════════════════════════════════════════════════════════════════════════
	describe('GET /box-seals', () => {
		it('should return an array of box seals', () => {
			jest
				.spyOn(getAllBoxSealsUseCase, 'handle')
				.mockResolvedValueOnce([mockBoxSeal, ...additionalEntities]);
			return request(app.getHttpServer())
				.get('/box-seals')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(3);
					expect(res.body[0]).toMatchObject({
						id: mockBoxSeal.id,
						name: mockBoxSeal.name,
					});
				});
		});

		it('should return empty array when no seals exist', () => {
			jest.spyOn(getAllBoxSealsUseCase, 'handle').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get('/box-seals')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /box-seals/:id  —  Get BoxSeal by ID
	// ═══════════════════════════════════════════════════════════════════════════
	describe.skip('GET /box-seals/:id', () => {
		it('should return a box seal by id', () => {
			jest
				.spyOn(getBoxSealByIdUseCase, 'handle')
				.mockResolvedValueOnce(mockBoxSeal);
			return request(app.getHttpServer())
				.get(`/box-seals/${mockBoxSeal.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockBoxSeal.id,
						name: mockBoxSeal.name,
						description: mockBoxSeal.description,
						logoMediaId: mockBoxSeal.logoMediaId,
					});
				});
		});

		it('should call the use case with the correct id', async () => {
			const spy = jest.spyOn(getBoxSealByIdUseCase, 'handle');
			await request(app.getHttpServer())
				.get(`/box-seals/${mockBoxSeal.id}`)
				.expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(mockBoxSeal.id);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// PUT /box-seals/:id  —  Update a BoxSeal
	// ═══════════════════════════════════════════════════════════════════════════
	describe.skip('PUT /box-seals/:id', () => {
		it('should update a box seal', () => {
			const updatedSeal = {
				...mockBoxSeal,
				name: updateDto.name,
				description: updateDto.description,
			};
			jest
				.spyOn(updateBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(updatedSeal as BoxSeal);
			return request(app.getHttpServer())
				.put(`/box-seals/${mockBoxSeal.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockBoxSeal.id,
						name: updateDto.name,
						description: updateDto.description,
					});
				});
		});

		it('should call the use case with id and update data', async () => {
			const updatedSeal = {
				...mockBoxSeal,
				name: updateDto.name,
				description: updateDto.description,
			};
			jest
				.spyOn(updateBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(updatedSeal as BoxSeal);
			await request(app.getHttpServer())
				.put(`/box-seals/${mockBoxSeal.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK);
			expect(updateBoxSealUseCase.handle).toHaveBeenCalledWith(
				mockBoxSeal.id,
				expect.objectContaining({
					name: updateDto.name,
					description: updateDto.description,
				}),
			);
		});

		it('should allow partial update (only name)', () => {
			const updatedSeal = { ...mockBoxSeal, name: 'Solo Nombre Nuevo' };
			jest
				.spyOn(updateBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(updatedSeal as BoxSeal);
			return request(app.getHttpServer())
				.put(`/box-seals/${mockBoxSeal.id}`)
				.send({ name: 'Solo Nombre Nuevo' })
				.expect(HttpStatus.OK);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// DELETE /box-seals/:id  —  Delete a BoxSeal
	// ═══════════════════════════════════════════════════════════════════════════
	describe.skip('DELETE /box-seals/:id', () => {
		it('should delete a box seal', () => {
			jest
				.spyOn(deleteBoxSealUseCase, 'handle')
				.mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/box-seals/${mockBoxSeal.id}`)
				.expect(HttpStatus.OK);
		});

		it('should call the use case with the correct id', async () => {
			const spy = jest.spyOn(deleteBoxSealUseCase, 'handle');
			await request(app.getHttpServer())
				.delete(`/box-seals/${mockBoxSeal.id}`)
				.expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(mockBoxSeal.id);
		});
	});
});

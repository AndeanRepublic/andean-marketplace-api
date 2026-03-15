import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FixtureLoader } from './fixture-loader';
import { JwtAuthGuard } from '../../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../../src/andean/infra/core/roles.guard';
import { createAllowAllGuard, mockAuthUsers } from './auth-test.helper';

/**
 * Configuration for a superfood sub-resource CRUD test suite.
 *
 * Each sub-resource (benefit, certification, type, etc.) shares the same
 * test structure: Create, Bulk Create, GetById, List, Delete with `handle` method.
 * This factory eliminates ~95% of duplicated code across those tests.
 */
export interface SubResourceTestConfig {
	/** Display name for the describe block, e.g. 'SuperfoodBenefit' */
	name: string;
	/** REST endpoint, e.g. '/superfood-benefits' */
	endpoint: string;
	/** Fixture filename in test/fixtures/, e.g. 'superfood-benefit.fixture.json' */
	fixtureName: string;
	/** The NestJS controller class */
	controller: any;
	/** Use case classes keyed by operation */
	useCases: {
		create: any;
		createMany: any;
		getById: any;
		list: any;
		delete: any;
	};
	/** If true, adds tests for "name already exists" (expects 500) */
	hasAlreadyExistsTest?: boolean;
	/** If true, adds test for "name is not a string" (expects 400) */
	hasNotStringTest?: boolean;
	/** If true, adds a "multiple items" list test using additionalEntities */
	hasMultipleItemsTest?: boolean;
}

/**
 * Generates a full e2e test suite for a superfood sub-resource.
 *
 * Usage:
 * ```ts
 * import { createSuperfoodSubResourceTests } from './helpers/superfood-subresource-test.factory';
 * createSuperfoodSubResourceTests({ name: '...', endpoint: '...', ... });
 * ```
 */
export function createSuperfoodSubResourceTests(
	config: SubResourceTestConfig,
): void {
	const fixture = FixtureLoader.load(config.fixtureName);
	const {
		entity,
		createDto,
		bulkCreateDto,
		optionalFieldName,
		additionalEntities,
	} = fixture;

	// Build the mock response with Date objects
	const mockResponse = {
		...entity,
		createdAt: new Date(entity.createdAt),
		updatedAt: new Date(entity.updatedAt),
	};

	describe(`${config.name}Controller (e2e)`, () => {
		let app: INestApplication;
		let createUseCase: any;
		let createManyUseCase: any;
		let getByIdUseCase: any;
		let listUseCase: any;
		let deleteUseCase: any;

		beforeAll(async () => {
			const moduleFixture: TestingModule = await Test.createTestingModule({
				controllers: [config.controller],
				providers: [
					{
						provide: config.useCases.create,
						useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
					},
					{
						provide: config.useCases.createMany,
						useValue: { handle: jest.fn().mockResolvedValue([mockResponse]) },
					},
					{
						provide: config.useCases.getById,
						useValue: { handle: jest.fn().mockResolvedValue(mockResponse) },
					},
					{
						provide: config.useCases.list,
						useValue: { handle: jest.fn().mockResolvedValue([mockResponse]) },
					},
					{
						provide: config.useCases.delete,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
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

			createUseCase = moduleFixture.get(config.useCases.create);
			createManyUseCase = moduleFixture.get(config.useCases.createMany);
			getByIdUseCase = moduleFixture.get(config.useCases.getById);
			listUseCase = moduleFixture.get(config.useCases.list);
			deleteUseCase = moduleFixture.get(config.useCases.delete);
		});

		afterAll(async () => {
			await app.close();
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		// ─── POST /bulk ──────────────────────────────────────────────────
		describe(`POST ${config.endpoint}/bulk`, () => {
			it(`should create multiple ${config.name}s in bulk`, () => {
				const bulkItems = additionalEntities.map((e: any) => ({
					...mockResponse,
					...e,
				}));
				jest
					.spyOn(createManyUseCase, 'handle')
					.mockResolvedValueOnce(bulkItems);

				return request(app.getHttpServer())
					.post(`${config.endpoint}/bulk`)
					.send(bulkCreateDto)
					.expect(HttpStatus.CREATED)
					.expect((res) => {
						expect(Array.isArray(res.body)).toBe(true);
						expect(res.body.length).toBeGreaterThan(0);
						res.body.forEach((item: any) => {
							expect(item).toMatchObject({
								id: expect.any(String),
								name: expect.any(String),
							});
						});
					});
			});

			it(`should return empty array when bulk list is empty`, () => {
				jest.spyOn(createManyUseCase, 'handle').mockResolvedValueOnce([]);

				const emptyBulk = { ...bulkCreateDto };
				const arrayKey = Object.keys(emptyBulk)[0];
				emptyBulk[arrayKey] = [];

				return request(app.getHttpServer())
					.post(`${config.endpoint}/bulk`)
					.send(emptyBulk)
					.expect(HttpStatus.CREATED)
					.expect((res) => {
						expect(Array.isArray(res.body)).toBe(true);
					});
			});

			it(`should return 400 when bulk body is missing the array field`, () => {
				return request(app.getHttpServer())
					.post(`${config.endpoint}/bulk`)
					.send({})
					.expect(HttpStatus.BAD_REQUEST);
			});
		});

		// ─── POST ────────────────────────────────────────────────────────
		describe(`POST ${config.endpoint}`, () => {
			it(`should create a new ${config.name}`, () => {
				jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockResponse);

				return request(app.getHttpServer())
					.post(config.endpoint)
					.send(createDto)
					.expect(HttpStatus.CREATED)
					.expect((res) => {
						expect(res.body).toMatchObject({
							id: expect.any(String),
							name: expect.any(String),
						});
						expect(res.body).toHaveProperty('createdAt');
						expect(res.body).toHaveProperty('updatedAt');
					});
			});

			it('should return 400 when name is missing', () => {
				const dtoWithoutName = { ...createDto };
				delete dtoWithoutName.name;

				return request(app.getHttpServer())
					.post(config.endpoint)
					.send(dtoWithoutName)
					.expect(HttpStatus.BAD_REQUEST);
			});

			it('should return 400 when name is empty string', () => {
				return request(app.getHttpServer())
					.post(config.endpoint)
					.send({ ...createDto, name: '' })
					.expect(HttpStatus.BAD_REQUEST);
			});

			if (optionalFieldName) {
				it(`should create ${config.name} without ${optionalFieldName} (optional field)`, () => {
					const withoutOptional = {
						...mockResponse,
						[optionalFieldName]: undefined,
					};
					jest
						.spyOn(createUseCase, 'handle')
						.mockResolvedValueOnce(withoutOptional);

					const dtoWithoutOptional = { ...createDto };
					delete dtoWithoutOptional[optionalFieldName];

					return request(app.getHttpServer())
						.post(config.endpoint)
						.send(dtoWithoutOptional)
						.expect(HttpStatus.CREATED)
						.expect((res) => {
							expect(res.body).toMatchObject({
								id: expect.any(String),
								name: expect.any(String),
							});
						});
				});
			}

			if (config.hasNotStringTest) {
				it('should return 400 when name is not a string', () => {
					return request(app.getHttpServer())
						.post(config.endpoint)
						.send({ name: 123 })
						.expect(HttpStatus.BAD_REQUEST);
				});
			}

			if (config.hasAlreadyExistsTest) {
				it(`should return 500 when ${config.name} name already exists`, () => {
					const error = new Error(`${config.name} name already exists`);
					jest.spyOn(createUseCase, 'handle').mockRejectedValueOnce(error);

					return request(app.getHttpServer())
						.post(config.endpoint)
						.send(createDto)
						.expect(HttpStatus.INTERNAL_SERVER_ERROR);
				});
			}
		});

		// ─── GET BY ID ───────────────────────────────────────────────────
		// SKIPPED: Route commented out in controller
		describe.skip(`GET ${config.endpoint}/:id`, () => {
			it(`should return a ${config.name} by id`, () => {
				jest
					.spyOn(getByIdUseCase, 'handle')
					.mockResolvedValueOnce(mockResponse);

				return request(app.getHttpServer())
					.get(`${config.endpoint}/${mockResponse.id}`)
					.expect(HttpStatus.OK)
					.expect((res) => {
						expect(res.body).toMatchObject({
							id: mockResponse.id,
							name: mockResponse.name,
						});
						expect(res.body).toHaveProperty('createdAt');
						expect(res.body).toHaveProperty('updatedAt');
					});
			});

			it(`should return 500 when ${config.name} not found`, () => {
				const error = new Error(`${config.name} not found`);
				jest.spyOn(getByIdUseCase, 'handle').mockRejectedValueOnce(error);

				return request(app.getHttpServer())
					.get(`${config.endpoint}/non-existent-id`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);
			});
		});

		// ─── LIST ────────────────────────────────────────────────────────
		describe(`GET ${config.endpoint}`, () => {
			it(`should return all ${config.name}s`, () => {
				const items = [
					mockResponse,
					...additionalEntities.map((e: any) => ({ ...mockResponse, ...e })),
				];
				jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(items);

				return request(app.getHttpServer())
					.get(config.endpoint)
					.expect(HttpStatus.OK)
					.expect((res) => {
						expect(Array.isArray(res.body)).toBe(true);
						expect(res.body).toHaveLength(items.length);
						res.body.forEach((item: any) => {
							expect(item).toMatchObject({
								id: expect.any(String),
								name: expect.any(String),
							});
						});
					});
			});

			it(`should return empty array when no ${config.name}s exist`, () => {
				jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([]);

				return request(app.getHttpServer())
					.get(config.endpoint)
					.expect(HttpStatus.OK)
					.expect((res) => {
						expect(Array.isArray(res.body)).toBe(true);
						expect(res.body).toHaveLength(0);
					});
			});

			if (config.hasMultipleItemsTest && additionalEntities?.length >= 2) {
				it(`should return multiple ${config.name}s with correct names`, () => {
					const items = [
						mockResponse,
						...additionalEntities.map((e: any) => ({ ...mockResponse, ...e })),
					];
					jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(items);

					return request(app.getHttpServer())
						.get(config.endpoint)
						.expect(HttpStatus.OK)
						.expect((res) => {
							expect(res.body).toHaveLength(items.length);
							items.forEach((item: any, index: number) => {
								expect(res.body[index].name).toBe(item.name);
							});
						});
				});
			}
		});

		// ─── DELETE ──────────────────────────────────────────────────────
		// SKIPPED: Route commented out in controller
		describe.skip(`DELETE ${config.endpoint}/:id`, () => {
			it(`should delete a ${config.name}`, () => {
				jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

				return request(app.getHttpServer())
					.delete(`${config.endpoint}/${mockResponse.id}`)
					.expect(HttpStatus.NO_CONTENT);
			});

			it(`should return 500 when ${config.name} to delete not found`, () => {
				const error = new Error(`${config.name} not found`);
				jest.spyOn(deleteUseCase, 'handle').mockRejectedValueOnce(error);

				return request(app.getHttpServer())
					.delete(`${config.endpoint}/non-existent-id`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);
			});
		});
	});
}

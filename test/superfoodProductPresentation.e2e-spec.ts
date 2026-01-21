import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperfoodProductPresentationController } from '../src/andean/infra/controllers/superfoodControllers/superfoodProductPresentation.controller';
import { CreateSuperfoodProductPresentationUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from '../src/andean/app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';
import { SuperfoodProductPresentationResponse } from '../src/andean/app/modules/SuperfoodProductPresentationResponse';

describe('SuperfoodProductPresentationController (e2e)', () => {
	let app: INestApplication;
	let createUseCase: CreateSuperfoodProductPresentationUseCase;
	let getByIdUseCase: GetSuperfoodProductPresentationByIdUseCase;
	let listUseCase: ListSuperfoodProductPresentationsUseCase;
	let deleteUseCase: DeleteSuperfoodProductPresentationUseCase;

	// Mock data
	const mockPresentation: SuperfoodProductPresentationResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		name: 'En polvo',
		icon: 'https://example.com/icons/polvo.svg',
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		name: 'En polvo',
		icon: 'https://example.com/icons/polvo.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [SuperfoodProductPresentationController],
			providers: [
				{
					provide: CreateSuperfoodProductPresentationUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPresentation),
					},
				},
				{
					provide: GetSuperfoodProductPresentationByIdUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPresentation),
					},
				},
				{
					provide: ListSuperfoodProductPresentationsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue([mockPresentation]),
					},
				},
				{
					provide: DeleteSuperfoodProductPresentationUseCase,
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

		createUseCase = moduleFixture.get<CreateSuperfoodProductPresentationUseCase>(CreateSuperfoodProductPresentationUseCase);
		getByIdUseCase = moduleFixture.get<GetSuperfoodProductPresentationByIdUseCase>(GetSuperfoodProductPresentationByIdUseCase);
		listUseCase = moduleFixture.get<ListSuperfoodProductPresentationsUseCase>(ListSuperfoodProductPresentationsUseCase);
		deleteUseCase = moduleFixture.get<DeleteSuperfoodProductPresentationUseCase>(DeleteSuperfoodProductPresentationUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /superfood-product-presentations', () => {
		it('should create a new product presentation', () => {
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(mockPresentation);

			return request(app.getHttpServer())
				.post('/superfood-product-presentations')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('name', mockPresentation.name);
					expect(res.body).toHaveProperty('icon', mockPresentation.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/superfood-product-presentations')
				.send({ icon: 'https://example.com/icons/test.svg' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is not a string', () => {
			return request(app.getHttpServer())
				.post('/superfood-product-presentations')
				.send({ name: 123 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should create presentation without icon (optional field)', () => {
			const withoutIcon = { ...mockPresentation, icon: undefined };
			jest.spyOn(createUseCase, 'handle').mockResolvedValueOnce(withoutIcon);

			return request(app.getHttpServer())
				.post('/superfood-product-presentations')
				.send({ name: 'En polvo' })
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('name', 'En polvo');
				});
		});

		it('should return 500 when presentation name already exists', async () => {
			const error = new Error('Product presentation name already exists');
			jest.spyOn(createUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.post('/superfood-product-presentations')
				.send(createDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-product-presentations/:id', () => {
		it('should return a product presentation by id', () => {
			jest.spyOn(getByIdUseCase, 'handle').mockResolvedValueOnce(mockPresentation);

			return request(app.getHttpServer())
				.get(`/superfood-product-presentations/${mockPresentation.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockPresentation.id);
					expect(res.body).toHaveProperty('name', mockPresentation.name);
					expect(res.body).toHaveProperty('icon', mockPresentation.icon);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 500 when presentation not found', () => {
			const error = new Error('Product presentation not found');
			jest.spyOn(getByIdUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/superfood-product-presentations/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /superfood-product-presentations', () => {
		it('should return an array of product presentations', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([mockPresentation]);

			return request(app.getHttpServer())
				.get('/superfood-product-presentations')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(1);
					expect(res.body[0]).toHaveProperty('id', mockPresentation.id);
					expect(res.body[0]).toHaveProperty('name', mockPresentation.name);
					expect(res.body[0]).toHaveProperty('icon', mockPresentation.icon);
				});
		});

		it('should return an empty array when no presentations exist', () => {
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/superfood-product-presentations')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});

		it('should return multiple presentations', () => {
			const mockPresentations = [
				mockPresentation,
				{ ...mockPresentation, id: 'uuid-2', name: 'En grano' },
				{ ...mockPresentation, id: 'uuid-3', name: 'Cápsulas' },
			];
			jest.spyOn(listUseCase, 'handle').mockResolvedValueOnce(mockPresentations);

			return request(app.getHttpServer())
				.get('/superfood-product-presentations')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(3);
					expect(res.body[0].name).toBe('En polvo');
					expect(res.body[1].name).toBe('En grano');
					expect(res.body[2].name).toBe('Cápsulas');
				});
		});
	});

	describe('DELETE /superfood-product-presentations/:id', () => {
		it('should delete a product presentation', () => {
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/superfood-product-presentations/${mockPresentation.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when presentation to delete not found', () => {
			const error = new Error('Product presentation not found');
			jest.spyOn(deleteUseCase, 'handle').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/superfood-product-presentations/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});

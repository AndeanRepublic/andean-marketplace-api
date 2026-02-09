import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FixtureLoader } from './helpers/fixture-loader';

// ─── Controller ─────────────────────────────────────────────────────────────
import { BoxController } from '../src/andean/infra/controllers/box.controller';

// ─── Use Cases ──────────────────────────────────────────────────────────────
import { CreateBoxUseCase } from '../src/andean/app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from '../src/andean/app/use_cases/boxes/GetAllBoxesUseCase';

// ─── Domain ─────────────────────────────────────────────────────────────────
import { Box } from '../src/andean/domain/entities/Box';

describe('BoxController (e2e)', () => {
	let app: INestApplication;
	let createBoxUseCase: CreateBoxUseCase;
	let getAllBoxesUseCase: GetAllBoxesUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadBox();
	const mockBox = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as Box;
	const createDto = fixture.createDto;
	const listResponse = fixture.listResponse;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [BoxController],
			providers: [
				{
					provide: CreateBoxUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBox) },
				},
				{
					provide: GetAllBoxesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(listResponse) },
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
		);
		await app.init();

		createBoxUseCase = moduleFixture.get(CreateBoxUseCase);
		getAllBoxesUseCase = moduleFixture.get(GetAllBoxesUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /boxes  —  Create a new Box
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /boxes', () => {
		it('should create a new box', () => {
			jest.spyOn(createBoxUseCase, 'handle').mockResolvedValueOnce(mockBox);
			return request(app.getHttpServer())
				.post('/boxes')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						title: mockBox.title,
						subtitle: mockBox.subtitle,
						description: mockBox.description,
						price: mockBox.price,
					});
					expect(res.body.products).toHaveLength(3);
					expect(res.body.sealIds).toHaveLength(2);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should call the use case with the correct DTO', async () => {
			jest.spyOn(createBoxUseCase, 'handle').mockResolvedValueOnce(mockBox);
			await request(app.getHttpServer())
				.post('/boxes')
				.send(createDto)
				.expect(HttpStatus.CREATED);
			expect(createBoxUseCase.handle).toHaveBeenCalledWith(
				expect.objectContaining({
					title: createDto.title,
					subtitle: createDto.subtitle,
					price: createDto.price,
				}),
			);
		});

		it('should return 400 when title is missing', () => {
			const { title, ...dtoWithoutTitle } = createDto;
			return request(app.getHttpServer())
				.post('/boxes')
				.send(dtoWithoutTitle)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when price is negative', () => {
			return request(app.getHttpServer())
				.post('/boxes')
				.send({ ...createDto, price: -10 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when price is zero', () => {
			return request(app.getHttpServer())
				.post('/boxes')
				.send({ ...createDto, price: 0 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when products is empty array', () => {
			return request(app.getHttpServer())
				.post('/boxes')
				.send({ ...createDto, products: [] })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when products is not provided', () => {
			const { products, ...dtoWithoutProducts } = createDto;
			return request(app.getHttpServer())
				.post('/boxes')
				.send(dtoWithoutProducts)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when thumbnailImageId is missing', () => {
			const { thumbnailImageId, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/boxes')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when mainImageId is missing', () => {
			const { mainImageId, ...dtoWithout } = createDto;
			return request(app.getHttpServer())
				.post('/boxes')
				.send(dtoWithout)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should accept a product with only productId (superfood)', () => {
			jest.spyOn(createBoxUseCase, 'handle').mockResolvedValueOnce(mockBox);
			return request(app.getHttpServer())
				.post('/boxes')
				.send({
					...createDto,
					products: [{ productId: 'superfood-uuid-123' }],
				})
				.expect(HttpStatus.CREATED);
		});

		it('should accept a product with only variantId (textile)', () => {
			jest.spyOn(createBoxUseCase, 'handle').mockResolvedValueOnce(mockBox);
			return request(app.getHttpServer())
				.post('/boxes')
				.send({
					...createDto,
					products: [{ variantId: 'variant-textile-001' }],
				})
				.expect(HttpStatus.CREATED);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /boxes  —  List all boxes (paginated)
	// ═══════════════════════════════════════════════════════════════════════════
	describe('GET /boxes', () => {
		it('should return paginated list of boxes with default pagination', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					// Validate top-level structure
					expect(res.body).toHaveProperty('data');
					expect(res.body).toHaveProperty('pagination');

					// Validate pagination defaults
					expect(res.body.pagination).toMatchObject({
						total: expect.any(Number),
						page: 1,
						per_page: 10,
					});

					// Validate data array
					expect(Array.isArray(res.body.data)).toBe(true);
				});
		});

		it('should call use case with default pagination when no query params', async () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			await request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK);
			expect(getAllBoxesUseCase.handle).toHaveBeenCalledWith(1, 10);
		});

		it('should pass custom page and per_page query params', async () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce({
				...listResponse,
				pagination: { total: 1, page: 2, per_page: 5 },
			});
			await request(app.getHttpServer())
				.get('/boxes?page=2&per_page=5')
				.expect(HttpStatus.OK);
			expect(getAllBoxesUseCase.handle).toHaveBeenCalledWith(2, 5);
		});

		it('should return correct data shape for each box in list', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const box = res.body.data[0];
					expect(box).toHaveProperty('id');
					expect(box).toHaveProperty('title');
					expect(box).toHaveProperty('subtitle');
					expect(box).toHaveProperty('itemCount');
					expect(box.itemCount).toHaveProperty('textiles');
					expect(box.itemCount).toHaveProperty('superfoods');
					expect(box).toHaveProperty('discartedPrice');
					expect(box).toHaveProperty('price');
					expect(box).toHaveProperty('porcentageDiscount');
					expect(box).toHaveProperty('thumbnailImage');
					expect(box.thumbnailImage).toHaveProperty('url');
					expect(box.thumbnailImage).toHaveProperty('name');
					expect(box).toHaveProperty('products');
					expect(Array.isArray(box.products)).toBe(true);
				});
		});

		it('should return correct product shape within each box', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const product = res.body.data[0].products[0];
					expect(product).toHaveProperty('name');
					expect(product).toHaveProperty('community');
					expect(product).toHaveProperty('type');
					expect(product).toHaveProperty('thumbnailImage');
					expect(product.thumbnailImage).toHaveProperty('url');
					expect(product.thumbnailImage).toHaveProperty('name');
				});
		});

		it('should return correct itemCount based on products', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const box = res.body.data[0];
					// fixture has 2 superfoods + 1 textile
					expect(box.itemCount.superfoods).toBe(2);
					expect(box.itemCount.textiles).toBe(1);
				});
		});

		it('should return correct price calculations', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const box = res.body.data[0];
					// discartedPrice = sum of individual product prices (25.50 + 30.00 + 150.00 = 205.50)
					expect(box.discartedPrice).toBe(205.50);
					// price is the box price
					expect(box.price).toBe(89.90);
					// porcentageDiscount = Math.round((1 - price/discartedPrice) * 100)
					expect(box.porcentageDiscount).toBe(56);
				});
		});

		it('should return empty data array when no boxes exist', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce({
				data: [],
				pagination: { total: 0, page: 1, per_page: 10 },
			});
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body.data).toEqual([]);
					expect(res.body.pagination.total).toBe(0);
				});
		});

		it('should differentiate superfood and textile products by type field', () => {
			jest.spyOn(getAllBoxesUseCase, 'handle').mockResolvedValueOnce(listResponse);
			return request(app.getHttpServer())
				.get('/boxes')
				.expect(HttpStatus.OK)
				.expect((res) => {
					const products = res.body.data[0].products;
					const superfoods = products.filter((p: any) => p.type === 'SUPERFOOD');
					const textiles = products.filter((p: any) => p.type === 'TEXTILE');
					expect(superfoods).toHaveLength(2);
					expect(textiles).toHaveLength(1);
				});
		});
	});
});

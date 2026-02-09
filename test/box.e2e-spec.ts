import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FixtureLoader } from './helpers/fixture-loader';

// ─── Controller ─────────────────────────────────────────────────────────────
import { BoxController } from '../src/andean/infra/controllers/box.controller';

// ─── Use Cases ──────────────────────────────────────────────────────────────
import { CreateBoxUseCase } from '../src/andean/app/use_cases/boxes/CreateBoxUseCase';
import { GetAllBoxesUseCase } from '../src/andean/app/use_cases/boxes/GetAllBoxesUseCase';
import { GetBoxDetailUseCase } from '../src/andean/app/use_cases/boxes/GetBoxDetailUseCase';

// ─── Domain ─────────────────────────────────────────────────────────────────
import { Box } from '../src/andean/domain/entities/box/Box';

describe('BoxController (e2e)', () => {
	let app: INestApplication;
	let createBoxUseCase: CreateBoxUseCase;
	let getAllBoxesUseCase: GetAllBoxesUseCase;
	let getBoxDetailUseCase: GetBoxDetailUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadBox();
	const mockBox = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as Box;
	const createDto = fixture.createDto;
	const listResponse = fixture.listResponse;
	const detailResponse = fixture.detailResponse;

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
				{
					provide: GetBoxDetailUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(detailResponse) },
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
		getBoxDetailUseCase = moduleFixture.get(GetBoxDetailUseCase);
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

	// ═══════════════════════════════════════════════════════════════════════════
	// GET /boxes/:boxId  —  Box detail
	// ═══════════════════════════════════════════════════════════════════════════
	describe('GET /boxes/:boxId', () => {
		const boxId = mockBox.id;

		it('should return the full box detail by id', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', boxId);
					expect(res.body).toHaveProperty('heroDetail');
					expect(res.body).toHaveProperty('detail');
					expect(res.body).toHaveProperty('containedProducts');
					expect(res.body).toHaveProperty('priceDetail');
					expect(res.body).toHaveProperty('boxSeals');
				});
		});

		it('should call the use case with the correct boxId', async () => {
			const spy = jest.spyOn(getBoxDetailUseCase, 'handle');
			await request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK);
			expect(spy).toHaveBeenCalledWith(boxId);
		});

		// ── heroDetail ────────────────────────────────────────────────────
		it('should return correct heroDetail shape', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const hero = res.body.heroDetail;
					expect(hero).toHaveProperty('title');
					expect(hero).toHaveProperty('subtitle');
					expect(hero).toHaveProperty('thumbnailImage');
					expect(hero.thumbnailImage).toHaveProperty('url');
					expect(hero.thumbnailImage).toHaveProperty('name');
					expect(hero).toHaveProperty('mainImage');
					expect(hero.mainImage).toHaveProperty('url');
					expect(hero.mainImage).toHaveProperty('name');
				});
		});

		it('should return correct heroDetail values from fixture', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const hero = res.body.heroDetail;
					expect(hero.title).toBe('Caja Andina Esencial');
					expect(hero.subtitle).toBe('Lo mejor de los Andes en una caja');
					expect(hero.thumbnailImage.url).toContain('box-thumbnail');
					expect(hero.mainImage.url).toContain('box-main');
				});
		});

		// ── detail ─────────────────────────────────────────────────────────
		it('should return correct detail shape', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const detail = res.body.detail;
					expect(detail).toHaveProperty('description');
					expect(detail).toHaveProperty('images');
					expect(Array.isArray(detail.images)).toBe(true);
					detail.images.forEach((img: any) => {
						expect(img).toHaveProperty('url');
						expect(img).toHaveProperty('name');
					});
				});
		});

		// ── containedProducts ──────────────────────────────────────────────
		it('should return correct containedProducts shape', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const products = res.body.containedProducts;
					expect(Array.isArray(products)).toBe(true);
					expect(products).toHaveLength(3);
					products.forEach((p: any) => {
						expect(p).toHaveProperty('id');
						expect(p).toHaveProperty('title');
						expect(p).toHaveProperty('thumbnailImage');
						expect(p.thumbnailImage).toHaveProperty('url');
						expect(p.thumbnailImage).toHaveProperty('name');
						expect(p).toHaveProperty('information');
						expect(p).toHaveProperty('type');
						expect(['SUPERFOOD', 'TEXTILE']).toContain(p.type);
						expect(p).toHaveProperty('discartedPrice');
						expect(p).toHaveProperty('price');
					});
				});
		});

		it('should contain both superfood and textile products', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const products = res.body.containedProducts;
					const superfoods = products.filter((p: any) => p.type === 'SUPERFOOD');
					const textiles = products.filter((p: any) => p.type === 'TEXTILE');
					expect(superfoods).toHaveLength(2);
					expect(textiles).toHaveLength(1);
				});
		});

		it('should return correct product prices in containedProducts', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const products = res.body.containedProducts;
					// Quinua = 25.50, Maca = 30.00, Poncho variant = 150.00
					expect(products[0].price).toBe(25.50);
					expect(products[1].price).toBe(30.00);
					expect(products[2].price).toBe(150.00);
				});
		});

		// ── priceDetail ────────────────────────────────────────────────────
		it('should return correct priceDetail shape and values', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const price = res.body.priceDetail;
					expect(price).toHaveProperty('discartedPrice');
					expect(price).toHaveProperty('totalPrice');
					expect(price).toHaveProperty('discountPorcentage');
					// discartedPrice = 25.50 + 30.00 + 150.00 = 205.50
					expect(price.discartedPrice).toBe(205.50);
					// totalPrice = box price
					expect(price.totalPrice).toBe(89.90);
					// discountPorcentage = Math.round((1 - 89.90/205.50) * 100) = 56
					expect(price.discountPorcentage).toBe(56);
				});
		});

		// ── boxSeals ───────────────────────────────────────────────────────
		it('should return correct boxSeals shape', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const seals = res.body.boxSeals;
					expect(Array.isArray(seals)).toBe(true);
					expect(seals).toHaveLength(2);
					seals.forEach((seal: any) => {
						expect(seal).toHaveProperty('name');
						expect(seal).toHaveProperty('description');
						expect(seal).toHaveProperty('logo');
						expect(seal.logo).toHaveProperty('url');
						expect(seal.logo).toHaveProperty('name');
					});
				});
		});

		it('should return correct seal values from fixture', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockResolvedValueOnce(detailResponse);
			return request(app.getHttpServer())
				.get(`/boxes/${boxId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					const seals = res.body.boxSeals;
					expect(seals[0].name).toBe('Sello Orgánico Certificado');
					expect(seals[1].name).toBe('Sello Comercio Justo');
				});
		});

		// ── error cases ────────────────────────────────────────────────────
		it('should return 404 when box is not found', () => {
			jest.spyOn(getBoxDetailUseCase, 'handle').mockRejectedValueOnce(
				new (require('@nestjs/common').NotFoundException)('Box not found'),
			);
			return request(app.getHttpServer())
				.get('/boxes/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});

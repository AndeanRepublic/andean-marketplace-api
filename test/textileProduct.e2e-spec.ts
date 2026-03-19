import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { TextileProductController } from '../src/andean/infra/controllers/textileProductControllers';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetByIdTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileProductUseCase';
import { UpdateTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { DeleteTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { TextileProduct } from '../src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductStatus } from '../src/andean/domain/enums/TextileProductStatus';
import { ProductSortBy } from '../src/andean/domain/enums/ProductSortBy';
import { CreateTextileCategoryUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { UpdateTextileCategoryUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileCategoryUseCase';
import { CreateTextileTypeUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { UpdateTextileTypeUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileTypeUseCase';
import { CreateTextileStyleUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { UpdateTextileStyleUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileStyleUseCase';
import { CreateTextileCraftTechniqueUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { UpdateTextileCraftTechniqueUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';
import { CreateTextilePrincipalUseUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { UpdateTextilePrincipalUseUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';
import { CreateTextileCertificationUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { UpdateTextileCertificationUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileCertificationUseCase';
import { CreateColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { GetAllColorOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { GetByIdTextileProductDetailUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileProductDetailUseCase';
import { FixtureLoader } from './helpers/fixture-loader';

/**
 * ⚠️  ARCHITECTURAL NOTE (God Controller)
 * TextileProductController is a god-controller that handles 8+ sub-resources
 * (categories, types, styles, subcategories, craft techniques, principal uses,
 * certifications, and color option alternatives) in a single controller.
 *
 * This results in:
 *  - 56 use-case mock providers just to create the test module
 *  - Coupling between unrelated concerns
 *
 * Recommended refactoring: split the controller into a Facade + dedicated
 * sub-controllers (one per resource), each with its own test file.
 * This would follow the same pattern as SuperfoodController + sub-resources.
 */
describe('TextileProductController (e2e)', () => {
	let app: INestApplication;
	let createTextileProductUseCase: CreateTextileProductUseCase;
	let getAllTextileProductsUseCase: GetAllTextileProductsUseCase;
	let getByIdTextileProductUseCase: GetByIdTextileProductUseCase;
	let updateTextileProductUseCase: UpdateTextileProductUseCase;
	let deleteTextileProductUseCase: DeleteTextileProductUseCase;

	// Load all mock data from JSON fixture
	const fixture = FixtureLoader.loadTextileProduct();
	const mockBaseInfo = fixture.entity.baseInfo;
	const mockPriceInventary = fixture.entity.priceInventary;
	const mockTextileProduct = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as TextileProduct;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;
	const mockTextileProductListItem = fixture.listItem;
	const mockPaginatedResponse = fixture.paginatedResponse;
	const mockDetailResponse = fixture.detailResponse;

	// Helper para crear mock de use case secundario (categorías, tipos, estilos, etc.)
	const createMockUseCase = () => ({ handle: jest.fn() });

	beforeAll(async () => {
		// Create testing module without database dependencies.
		// Following TESTING_GUIDE.md: mock use cases instead of importing the full module.
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [TextileProductController],
			providers: [
				// ── TextileProduct use cases ────────────────────────────────────
				{
					provide: CreateTextileProductUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockTextileProduct) },
				},
				{
					provide: GetAllTextileProductsUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
					},
				},
				{
					provide: GetByIdTextileProductUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockTextileProduct) },
				},
				{
					provide: UpdateTextileProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockTextileProduct,
							baseInfo: { ...mockBaseInfo, title: updateDto.baseInfo.title },
							priceInventary: {
								...mockPriceInventary,
								basePrice: updateDto.priceInventary.basePrice,
								totalStock: updateDto.priceInventary.totalStock,
								currency: updateDto.priceInventary.currency,
							},
						}),
					},
				},
				{
					provide: DeleteTextileProductUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: GetByIdTextileProductDetailUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockDetailResponse) },
				},
				// ── Category use cases ──────────────────────────────────────────
				{
					provide: CreateTextileCategoryUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: UpdateTextileCategoryUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetAllTextileCategoriesUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetByIdTextileCategoryUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: DeleteTextileCategoryUseCase,
					useValue: createMockUseCase(),
				},
				// ── Type use cases ──────────────────────────────────────────────
				{ provide: CreateTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileTypesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileTypeUseCase, useValue: createMockUseCase() },
				// ── Style use cases ─────────────────────────────────────────────
				{ provide: CreateTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileStylesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileStyleUseCase, useValue: createMockUseCase() },
				// ── CraftTechnique use cases ────────────────────────────────────
				{
					provide: CreateTextileCraftTechniqueUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: UpdateTextileCraftTechniqueUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetAllTextileCraftTechniquesUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetByIdTextileCraftTechniqueUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: DeleteTextileCraftTechniqueUseCase,
					useValue: createMockUseCase(),
				},
				// ── PrincipalUse use cases ──────────────────────────────────────
				{
					provide: CreateTextilePrincipalUseUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: UpdateTextilePrincipalUseUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetAllTextilePrincipalUsesUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetByIdTextilePrincipalUseUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: DeleteTextilePrincipalUseUseCase,
					useValue: createMockUseCase(),
				},
				// ── Certification use cases ─────────────────────────────────────
				{
					provide: CreateTextileCertificationUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: UpdateTextileCertificationUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetAllTextileCertificationsUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetByIdTextileCertificationUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: DeleteTextileCertificationUseCase,
					useValue: createMockUseCase(),
				},
				// ── ColorOptionAlternative use cases ────────────────────────────
				{
					provide: CreateColorOptionAlternativeUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: UpdateColorOptionAlternativeUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetAllColorOptionAlternativesUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: GetByIdColorOptionAlternativeUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: DeleteColorOptionAlternativeUseCase,
					useValue: createMockUseCase(),
				},
				{
					provide: CreateManyColorOptionAlternativesUseCase,
					useValue: createMockUseCase(),
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

		createTextileProductUseCase = moduleFixture.get(
			CreateTextileProductUseCase,
		);
		getAllTextileProductsUseCase = moduleFixture.get(
			GetAllTextileProductsUseCase,
		);
		getByIdTextileProductUseCase = moduleFixture.get(
			GetByIdTextileProductUseCase,
		);
		updateTextileProductUseCase = moduleFixture.get(
			UpdateTextileProductUseCase,
		);
		deleteTextileProductUseCase = moduleFixture.get(
			DeleteTextileProductUseCase,
		);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	// ─── POST /textile-products ────────────────────────────────────────────────
	describe('POST /textile-products', () => {
		it('should create a new textile product', () => {
			jest
				.spyOn(createTextileProductUseCase, 'handle')
				.mockResolvedValueOnce(mockTextileProduct);

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						status: mockTextileProduct.status,
						baseInfo: expect.objectContaining({ title: mockBaseInfo.title }),
						priceInventary: expect.objectContaining({
							basePrice: mockPriceInventary.basePrice,
							totalStock: mockPriceInventary.totalStock,
							currency: mockPriceInventary.currency,
							SKU: mockPriceInventary.SKU,
						}),
						categoryId: expect.any(String),
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should call the use case with correct dto', async () => {
			const spy = jest.spyOn(createTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.post('/textile-products')
				.send(createDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(createDto);
		});

		it('should return 400 when baseInfo.title is missing', () => {
			return request(app.getHttpServer())
				.post('/textile-products')
				.send({
					...createDto,
					baseInfo: { ...createDto.baseInfo, title: undefined },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basePrice is less than 0', () => {
			return request(app.getHttpServer())
				.post('/textile-products')
				.send({
					...createDto,
					priceInventary: { ...createDto.priceInventary, basePrice: -1 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when totalStock is negative', () => {
			return request(app.getHttpServer())
				.post('/textile-products')
				.send({
					...createDto,
					priceInventary: { ...createDto.priceInventary, totalStock: -1 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			return request(app.getHttpServer())
				.post('/textile-products')
				.send({ ...createDto, status: 'INVALID_STATUS' })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ─── GET /textile-products ─────────────────────────────────────────────────
	describe('GET /textile-products', () => {
		it('should get all textile products without pagination', async () => {
			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
			expect(Array.isArray(response.body.products)).toBe(true);
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body.pagination).toHaveProperty('page');
			expect(response.body.pagination).toHaveProperty('per_page');
		});

		it('should return filterCount with all products', async () => {
			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('filterCount');
			expect(response.body.filterCount).toHaveProperty('colors');
			expect(response.body.filterCount).toHaveProperty('sizes');
			expect(response.body.filterCount).toHaveProperty('communities');
			expect(response.body.filterCount).toHaveProperty('categories');
			expect(Array.isArray(response.body.filterCount.colors)).toBe(true);
			expect(Array.isArray(response.body.filterCount.sizes)).toBe(true);
			expect(Array.isArray(response.body.filterCount.communities)).toBe(true);
			expect(Array.isArray(response.body.filterCount.categories)).toBe(true);
		});

		it('should return filterCount items with label and count properties', async () => {
			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			const { colors, sizes, communities, categories } =
				response.body.filterCount;

			if (colors.length > 0) {
				expect(colors[0]).toHaveProperty('label');
				expect(colors[0]).toHaveProperty('count');
				expect(typeof colors[0].label).toBe('string');
				expect(typeof colors[0].count).toBe('number');
			}
			if (sizes.length > 0) {
				expect(sizes[0]).toHaveProperty('label');
				expect(sizes[0]).toHaveProperty('count');
			}
			if (communities.length > 0) {
				expect(communities[0]).toHaveProperty('label');
				expect(communities[0]).toHaveProperty('count');
			}
			if (categories.length > 0) {
				expect(categories[0]).toHaveProperty('label');
				expect(categories[0]).toHaveProperty('count');
			}
		});

		it('should get textile products with pagination', async () => {
			const paginatedResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 100, page: 2, per_page: 20 },
				filterCount: mockPaginatedResponse.filterCount,
			};

			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(paginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?page=2&per_page=20')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body.pagination).toHaveProperty('page');
			expect(response.body.pagination).toHaveProperty('per_page');
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should call the use case with correct pagination params', async () => {
			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/textile-products?page=3&per_page=15')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ page: 3, perPage: 15 });
		});

		it('should filter textile products by color', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [{ label: 'rojo', count: 15 }],
					sizes: [
						{ label: 'm', count: 5 },
						{ label: 'l', count: 10 },
					],
					communities: [],
					categories: [{ label: 'Ponchos', count: 15 }],
				},
			};

			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?color=rojo')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body.products).toHaveLength(1);
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should filter textile products by size', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [
						{ label: 'rojo', count: 5 },
						{ label: 'azul', count: 3 },
					],
					sizes: [{ label: 'm', count: 8 }],
					communities: [],
					categories: [],
				},
			};

			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?size=M')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should filter textile products by price range', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [{ label: 'rojo', count: 5 }],
					sizes: [{ label: 'm', count: 5 }],
					communities: [{ label: 'Comunidad Andina Norte', count: 5 }],
					categories: [{ label: 'Ponchos', count: 5 }],
				},
			};

			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?min_price=100&max_price=200')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body).toHaveProperty('filterCount');
			expect(response.body.filterCount.colors.length).toBeGreaterThan(0);
		});

		it('should filter textile products by color and size combined', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [{ label: 'rojo', count: 3 }],
					sizes: [{ label: 'l', count: 3 }],
					communities: [],
					categories: [],
				},
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?color=rojo&size=L')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ color: 'rojo', size: 'L' });
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should filter textile products by category_id', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [{ label: 'rojo', count: 10 }],
					sizes: [{ label: 'm', count: 10 }],
					communities: [],
					categories: [{ label: 'Ponchos', count: 10 }],
				},
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get(`/textile-products?category_id=${createDto.categoryId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ categoryId: createDto.categoryId });
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should filter textile products by owner_id', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: {
					colors: [{ label: 'rojo', count: 5 }],
					sizes: [{ label: 'l', count: 5 }],
					communities: [{ label: 'Comunidad Textil Sur', count: 5 }],
					categories: [],
				},
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get(`/textile-products?owner_id=${mockBaseInfo.ownerId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ ownerId: mockBaseInfo.ownerId });
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should combine multiple filters (category, color, size, price, pagination)', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 2, per_page: 20 },
				filterCount: {
					colors: [{ label: 'rojo', count: 1 }],
					sizes: [{ label: 'l', count: 1 }],
					communities: [],
					categories: [{ label: 'Ponchos', count: 1 }],
				},
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get(
					`/textile-products?category_id=${createDto.categoryId}&color=rojo&size=L&min_price=100&max_price=200&page=2&per_page=20`,
				)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({
				categoryId: createDto.categoryId,
				color: 'rojo',
				size: 'L',
				minPrice: 100,
				maxPrice: 200,
				page: 2,
				perPage: 20,
			});
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should work without any filters (backward compatibility)', async () => {
			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle');

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(undefined);
			expect(response.body).toHaveProperty('filterCount');
		});

		it('should include filterCount when filtering by community through detailTraceability', async () => {
			const filteredResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: mockPaginatedResponse.filterCount,
			};

			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			expect(response.body.filterCount).toHaveProperty('communities');
			expect(Array.isArray(response.body.filterCount.communities)).toBe(true);
		});

		it('should return 404 when no products match filters', async () => {
			jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockImplementationOnce(() => {
					throw {
						statusCode: 404,
						message: 'No textile products found with the specified filters',
					};
				});

			await request(app.getHttpServer())
				.get('/textile-products?color=nonexistent')
				.expect(HttpStatus.NOT_FOUND);
		});

		it('should sort textile products by latest (most recent first)', async () => {
			const sortedResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: mockPaginatedResponse.filterCount,
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(sortedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?sort_by=latest')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ sortBy: ProductSortBy.LATEST });
			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
		});

		it('should sort textile products by popular (most purchased first)', async () => {
			const sortedResponse = {
				products: [mockTextileProductListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
				filterCount: mockPaginatedResponse.filterCount,
			};

			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce(sortedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?sort_by=popular')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ sortBy: ProductSortBy.POPULAR });
			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
		});

		it('should combine sort_by with other filters', async () => {
			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce({
					products: [mockTextileProductListItem],
					pagination: { total: 1, page: 1, per_page: 10 },
					filterCount: mockPaginatedResponse.filterCount,
				});

			const response = await request(app.getHttpServer())
				.get(
					`/textile-products?sort_by=popular&category_id=${createDto.categoryId}&page=1&per_page=20`,
				)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({
				sortBy: ProductSortBy.POPULAR,
				categoryId: createDto.categoryId,
				page: 1,
				perPage: 20,
			});
			expect(response.body).toHaveProperty('products');
		});

		it('should combine sort_by=latest with color and price filters', async () => {
			const spy = jest
				.spyOn(getAllTextileProductsUseCase, 'handle')
				.mockResolvedValueOnce({
					products: [mockTextileProductListItem],
					pagination: { total: 1, page: 1, per_page: 10 },
					filterCount: mockPaginatedResponse.filterCount,
				});

			const response = await request(app.getHttpServer())
				.get(
					'/textile-products?sort_by=latest&color=rojo&min_price=50&max_price=200',
				)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({
				sortBy: ProductSortBy.LATEST,
				color: 'rojo',
				minPrice: 50,
				maxPrice: 200,
			});
			expect(response.body).toHaveProperty('products');
		});
	});

	// SKIPPED: Route GET /:id commented out in controller (only GET /:id/details is active)
	describe.skip('GET /textile-products/:id', () => {
		const productId = fixture.entity.id;

		it('should get a textile product by id', () => {
			jest
				.spyOn(getByIdTextileProductUseCase, 'handle')
				.mockResolvedValueOnce(mockTextileProduct);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockTextileProduct.id,
						status: mockTextileProduct.status,
						baseInfo: expect.objectContaining({ title: mockBaseInfo.title }),
						priceInventary: expect.objectContaining({
							basePrice: mockPriceInventary.basePrice,
							totalStock: mockPriceInventary.totalStock,
						}),
					});
				});
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(getByIdTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/textile-products/${productId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(productId);
		});
	});

	// ─── GET /textile-products/:id/details ────────────────────────────────────
	describe('GET /textile-products/:id/details', () => {
		const productId = fixture.entity.id;
		let getByIdTextileProductDetailUseCase: GetByIdTextileProductDetailUseCase;

		beforeEach(() => {
			getByIdTextileProductDetailUseCase = app.get(
				GetByIdTextileProductDetailUseCase,
			);
		});

		it('should return the full detail response with id', () => {
			jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockDetailResponse.id);
					expect(res.body).toHaveProperty('title', mockDetailResponse.title);
				});
		});

		it('should call the use case with the correct id', async () => {
			const spy = jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			await request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(productId);
		});

		it('should include variantInfo with color as object', () => {
			jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body.variantInfo)).toBe(true);
					if (res.body.variantInfo.length > 0) {
						expect(res.body.variantInfo[0]).toHaveProperty('color');
						expect(res.body.variantInfo[0].color).toHaveProperty('color');
						expect(res.body.variantInfo[0].color).toHaveProperty('hexCode');
						expect(res.body.variantInfo[0].color).toHaveProperty('imgUrl');
					}
				});
		});

		it('should include reviews with rating and comments', () => {
			jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('reviews');
					expect(res.body.reviews).toHaveProperty('rating');
					expect(res.body.reviews).toHaveProperty('comments');
					expect(Array.isArray(res.body.reviews.comments)).toBe(true);
				});
		});

		it('should include similarProducts with id on each item', () => {
			jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body.similarProducts)).toBe(true);
					if (res.body.similarProducts.length > 0) {
						expect(res.body.similarProducts[0]).toHaveProperty('id');
						expect(res.body.similarProducts[0]).toHaveProperty('title');
						expect(res.body.similarProducts[0]).toHaveProperty('price');
						expect(res.body.similarProducts[0]).toHaveProperty('variantInfo');
						expect(Array.isArray(res.body.similarProducts[0].variantInfo)).toBe(
							true,
						);
					}
				});
		});

		it('should include traceabilityInfo with correct structure', () => {
			jest
				.spyOn(getByIdTextileProductDetailUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse as any);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}/details`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('traceabilityInfo');
					expect(res.body.traceabilityInfo).toHaveProperty('origen');
					expect(res.body.traceabilityInfo).toHaveProperty('processing');
					expect(res.body.traceabilityInfo).toHaveProperty('development');
					expect(res.body.traceabilityInfo).toHaveProperty('merchandising');
				});
		});
	});

	// ─── PUT /textile-products/:id ─────────────────────────────────────────────
	describe('PUT /textile-products/:id', () => {
		const productId = fixture.entity.id;
		const updatedProduct = {
			...mockTextileProduct,
			baseInfo: { ...mockBaseInfo, title: updateDto.baseInfo.title },
			priceInventary: {
				...mockPriceInventary,
				basePrice: updateDto.priceInventary.basePrice,
				totalStock: updateDto.priceInventary.totalStock,
				currency: updateDto.priceInventary.currency,
			},
		};

		it('should update a textile product', () => {
			jest
				.spyOn(updateTextileProductUseCase, 'handle')
				.mockResolvedValueOnce(updatedProduct);

			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: productId,
						baseInfo: expect.objectContaining({
							title: updateDto.baseInfo.title,
						}),
						priceInventary: expect.objectContaining({
							basePrice: updateDto.priceInventary.basePrice,
							totalStock: updateDto.priceInventary.totalStock,
						}),
					});
				});
		});

		it('should call the use case with correct productId and dto', async () => {
			const spy = jest.spyOn(updateTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				productId,
				expect.objectContaining({
					status: updateDto.status,
					baseInfo: expect.objectContaining({
						title: updateDto.baseInfo.title,
					}),
				}),
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
		});

		it('should return 400 when updating with invalid basePrice', () => {
			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send({
					...updateDto,
					priceInventary: { ...updateDto.priceInventary, basePrice: -10 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when updating with invalid totalStock', () => {
			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send({
					...updateDto,
					priceInventary: { ...updateDto.priceInventary, totalStock: -5 },
				})
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ─── DELETE /textile-products/:id ──────────────────────────────────────────
	describe('DELETE /textile-products/:id', () => {
		const productId = fixture.entity.id;

		it('should delete a textile product', () => {
			jest
				.spyOn(deleteTextileProductUseCase, 'handle')
				.mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/textile-products/${productId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(deleteTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/textile-products/${productId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				productId,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
		});
	});

	// ─── Ownership enforcement (PUT/DELETE) ────────────────────────────────────
	describe('ownership enforcement', () => {
		const productId = fixture.entity.id;

		// Helper to build app with a given auth user
		async function buildApp(
			authUser: { userId: string; email: string; roles: any[] } | null,
		): Promise<INestApplication> {
			const createMockUseCase = () => ({ handle: jest.fn() });
			const module: TestingModule = await Test.createTestingModule({
				controllers: [TextileProductController],
				providers: [
					{
						provide: CreateTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: GetAllTextileProductsUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: GetByIdTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: UpdateTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: DeleteTextileProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: GetByIdTextileProductDetailUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockDetailResponse),
						},
					},
					{
						provide: CreateTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCategoriesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{ provide: CreateTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: UpdateTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: GetAllTextileTypesUseCase, useValue: createMockUseCase() },
					{ provide: GetByIdTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: DeleteTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: CreateTextileStyleUseCase, useValue: createMockUseCase() },
					{ provide: UpdateTextileStyleUseCase, useValue: createMockUseCase() },
					{
						provide: GetAllTextileStylesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileStyleUseCase,
						useValue: createMockUseCase(),
					},
					{ provide: DeleteTextileStyleUseCase, useValue: createMockUseCase() },
					{
						provide: CreateTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCraftTechniquesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextilePrincipalUsesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCertificationsUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllColorOptionAlternativesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateManyColorOptionAlternativesUseCase,
						useValue: createMockUseCase(),
					},
				],
			})
				.overrideGuard(JwtAuthGuard)
				.useValue(
					authUser ? createAllowAllGuard(authUser) : createDenyAllGuard(),
				)
				.overrideGuard(RolesGuard)
				.useValue({ canActivate: () => true })
				.compile();

			const app = module.createNestApplication();
			app.useGlobalPipes(
				new ValidationPipe({
					whitelist: true,
					forbidNonWhitelisted: true,
					transform: true,
				}),
			);
			await app.init();
			return app;
		}

		// ── PUT /textile-products/:id ownership ──────────────────────────
		describe('PUT /textile-products/:id', () => {
			it('should return 200 when SELLER owner updates the product', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(UpdateTextileProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockTextileProduct);

				await request(ownerApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to update', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(UpdateTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to update COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 200 when ADMIN updates any product', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(UpdateTextileProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockTextileProduct);

				await request(adminApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});

		// ── DELETE /textile-products/:id ownership ───────────────────────
		describe('DELETE /textile-products/:id', () => {
			it('should return 204 when SELLER owner deletes the product', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(DeleteTextileProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(ownerApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.NO_CONTENT);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to delete', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(DeleteTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to delete COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 204 when ADMIN deletes any product', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(DeleteTextileProductUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(adminApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.NO_CONTENT);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});
	});

	// ─── Pattern A/F negative-path enforcement ─────────────────────────────────
	describe('Pattern A/F negative-path enforcement', () => {
		const productId = fixture.entity.id;

		async function buildAppWithRoles(
			authUser: { userId: string; email: string; roles: any[] } | null,
			allowRoles = true,
		): Promise<INestApplication> {
			const createMockUseCase = () => ({ handle: jest.fn() });
			const module: TestingModule = await Test.createTestingModule({
				controllers: [TextileProductController],
				providers: [
					{
						provide: CreateTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: GetAllTextileProductsUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: GetByIdTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: UpdateTextileProductUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockTextileProduct),
						},
					},
					{
						provide: DeleteTextileProductUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: GetByIdTextileProductDetailUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockDetailResponse),
						},
					},
					{
						provide: CreateTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCategoriesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCategoryUseCase,
						useValue: createMockUseCase(),
					},
					{ provide: CreateTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: UpdateTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: GetAllTextileTypesUseCase, useValue: createMockUseCase() },
					{ provide: GetByIdTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: DeleteTextileTypeUseCase, useValue: createMockUseCase() },
					{ provide: CreateTextileStyleUseCase, useValue: createMockUseCase() },
					{ provide: UpdateTextileStyleUseCase, useValue: createMockUseCase() },
					{
						provide: GetAllTextileStylesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileStyleUseCase,
						useValue: createMockUseCase(),
					},
					{ provide: DeleteTextileStyleUseCase, useValue: createMockUseCase() },
					{
						provide: CreateTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCraftTechniquesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCraftTechniqueUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextilePrincipalUsesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextilePrincipalUseUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllTextileCertificationsUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteTextileCertificationUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: UpdateColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetAllColorOptionAlternativesUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: GetByIdColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: DeleteColorOptionAlternativeUseCase,
						useValue: createMockUseCase(),
					},
					{
						provide: CreateManyColorOptionAlternativesUseCase,
						useValue: createMockUseCase(),
					},
				],
			})
				.overrideGuard(JwtAuthGuard)
				.useValue(
					authUser ? createAllowAllGuard(authUser) : createDenyAllGuard(),
				)
				.overrideGuard(RolesGuard)
				.useValue({ canActivate: () => allowRoles })
				.compile();

			const app = module.createNestApplication();
			app.useGlobalPipes(
				new ValidationPipe({
					whitelist: true,
					forbidNonWhitelisted: true,
					transform: true,
				}),
			);
			await app.init();
			return app;
		}

		// ── POST /textile-products — Pattern A USER→403 ───────────────────
		describe('POST /textile-products', () => {
			it('should return 403 when USER tries to create a textile product', async () => {
				const userApp = await buildAppWithRoles(mockAuthUsers.customer, false);

				await request(userApp.getHttpServer())
					.post('/textile-products')
					.send(createDto)
					.expect(HttpStatus.FORBIDDEN);

				await userApp.close();
			});
		});

		// ── PUT /textile-products/:id — Pattern F negative paths ──────────
		describe('PUT /textile-products/:id', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/textile-products/${productId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when textile product does not exist', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new NotFoundException('Textile product not found'),
					);

				await request(sellerApp.getHttpServer())
					.put('/textile-products/non-existent-id')
					.send(updateDto)
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});

		// ── DELETE /textile-products/:id — Pattern F negative paths ───────
		describe('DELETE /textile-products/:id', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/textile-products/${productId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when textile product does not exist', async () => {
				const sellerApp = await buildAppWithRoles(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteTextileProductUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new NotFoundException('Textile product not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete('/textile-products/non-existent-id')
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});
	});
});

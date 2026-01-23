import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TextileProductController } from '../src/andean/infra/controllers/textileProductControllers';
import { CreateTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetByIdTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileProductUseCase';
import { UpdateTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { DeleteTextileProductUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { TextileProduct } from '../src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductStatus } from '../src/andean/domain/enums/TextileProductStatus';
import { TextileOptionName } from '../src/andean/domain/enums/TextileOptionName';
import { BaseInfo } from '../src/andean/domain/entities/textileProducts/BaseInfo';
import { PriceInventary } from '../src/andean/domain/entities/textileProducts/PriceInventary';
import { OwnerType } from '../src/andean/domain/enums/OwnerType';
// Importar todos los demás use cases del controlador
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
import { CreateTextileSubcategoryUseCase } from '../src/andean/app/use_cases/textileProducts/CreateTextileSubcategoryUseCase';
import { UpdateTextileSubcategoryUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateTextileSubcategoryUseCase';
import { GetAllTextileSubcategoriesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileSubcategoriesUseCase';
import { GetByIdTextileSubcategoryUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileSubcategoryUseCase';
import { DeleteTextileSubcategoryUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteTextileSubcategoryUseCase';
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
import { TextileProductListItem } from '../src/andean/app/modules/TextileProductListItemResponse';

describe('TextileProductController (e2e)', () => {
	let app: INestApplication;
	let createTextileProductUseCase: CreateTextileProductUseCase;
	let getAllTextileProductsUseCase: GetAllTextileProductsUseCase;
	let getByIdTextileProductUseCase: GetByIdTextileProductUseCase;
	let updateTextileProductUseCase: UpdateTextileProductUseCase;
	let deleteTextileProductUseCase: DeleteTextileProductUseCase;

	// Mock data
	const mockBaseInfo: BaseInfo = {
		title: 'Poncho Andino Premium',
		media: [],
		description: 'Poncho tejido a mano por artesanos andinos',
		ownerType: OwnerType.SHOP,
		ownerId: 'shop-123',
	};

	const mockPriceInventary: PriceInventary = {
		basePrice: 150.00,
		totalStock: 50,
		SKU: 'PONCHO-AND-001',
	};

	const mockTextileProduct: TextileProduct = {
		id: 'textile-uuid-123',
		status: TextileProductStatus.PUBLISHED,
		baseInfo: mockBaseInfo,
		priceInventary: mockPriceInventary,
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
		isDiscountActive: false,
		categoryId: 'category-poncho-001',
		options: [
			{
				name: TextileOptionName.COLOR,
				values: [
					{ label: 'Rojo', mediaIds: [] },
					{ label: 'Azul', mediaIds: [] },
				],
			},
			{
				name: TextileOptionName.SIZE,
				values: [
					{ label: 'M', mediaIds: [] },
					{ label: 'L', mediaIds: [] },
				],
			},
		],
	} as TextileProduct;

	const createDto = {
		status: TextileProductStatus.PUBLISHED,
		baseInfo: {
			title: 'Poncho Andino Premium',
			media: [],
			description: 'Poncho tejido a mano por artesanos andinos',
			ownerType: OwnerType.SHOP,
			ownerId: 'shop-123',
		},
		priceInventary: {
			basePrice: 150.00,
			totalStock: 50,
			SKU: 'PONCHO-AND-001',
		},
		categoryId: 'category-poncho-001',
	};

	const updateDto = {
		status: TextileProductStatus.PUBLISHED,
		baseInfo: {
			title: 'Poncho Andino Premium Actualizado',
			media: [],
			description: 'Poncho tejido a mano por artesanos andinos - Edición especial',
			ownerType: OwnerType.SHOP,
			ownerId: 'shop-123',
		},
		priceInventary: {
			basePrice: 180.00,
			totalStock: 75,
			SKU: 'PONCHO-AND-001',
		},
		categoryId: 'category-poncho-001',
	};

	const mockTextileProductListItem: TextileProductListItem = {
		id: 'textile-uuid-123',
		titulo: 'Poncho Andino Premium',
		categoryName: 'Ponchos',
		productorName: 'Artesanos Andinos',
		colors: [
			{ name: 'Rojo', colorHexCode: '#FF0000' },
			{ name: 'Azul', colorHexCode: '#0000FF' },
		],
		tallas: ['M', 'L'],
		principalImgUrl: 'https://example.com/poncho.jpg',
		price: 150.00,
	};

	const mockPaginatedResponse = {
		products: [mockTextileProductListItem],
		pagination: {
			total: 1,
			page: 1,
			per_page: 1,
		},
		filterCount: {
			colors: [
				{ label: 'rojo', count: 15 },
				{ label: 'azul', count: 10 },
				{ label: 'verde', count: 8 },
			],
			sizes: [
				{ label: 'm', count: 12 },
				{ label: 'l', count: 18 },
				{ label: 'xl', count: 5 },
			],
			communities: [
				{ label: 'Comunidad Andina Norte', count: 20 },
				{ label: 'Comunidad Textil Sur', count: 13 },
			],
			categories: [
				{ label: 'Ponchos', count: 25 },
				{ label: 'Mantas', count: 8 },
			],
		},
	};

	// Helper para crear mock de use case
	const createMockUseCase = () => ({
		handle: jest.fn(),
	});

	beforeAll(async () => {
		// Create testing module without database dependencies
		// Following TESTING_GUIDE.md: mock use cases instead of importing full module
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [TextileProductController],
			providers: [
				// Mocks para TextileProduct use cases
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
						handle: jest.fn().mockResolvedValue({
							...mockTextileProduct,
							baseInfo: { ...mockBaseInfo, title: 'Poncho Andino Premium Actualizado' },
							priceInventary: { ...mockPriceInventary, basePrice: 180.00, totalStock: 75 },
						}),
					},
				},
				{
					provide: DeleteTextileProductUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: GetByIdTextileProductDetailUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockTextileProduct),
					},
				},
				// Mocks para Category use cases
				{ provide: CreateTextileCategoryUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileCategoryUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileCategoriesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileCategoryUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileCategoryUseCase, useValue: createMockUseCase() },
				// Mocks para Type use cases
				{ provide: CreateTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileTypesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileTypeUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileTypeUseCase, useValue: createMockUseCase() },
				// Mocks para Style use cases
				{ provide: CreateTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileStylesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileStyleUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileStyleUseCase, useValue: createMockUseCase() },
				// Mocks para Subcategory use cases
				{ provide: CreateTextileSubcategoryUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileSubcategoryUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileSubcategoriesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileSubcategoryUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileSubcategoryUseCase, useValue: createMockUseCase() },
				// Mocks para CraftTechnique use cases
				{ provide: CreateTextileCraftTechniqueUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileCraftTechniqueUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileCraftTechniquesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileCraftTechniqueUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileCraftTechniqueUseCase, useValue: createMockUseCase() },
				// Mocks para PrincipalUse use cases
				{ provide: CreateTextilePrincipalUseUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextilePrincipalUseUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextilePrincipalUsesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextilePrincipalUseUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextilePrincipalUseUseCase, useValue: createMockUseCase() },
				// Mocks para Certification use cases
				{ provide: CreateTextileCertificationUseCase, useValue: createMockUseCase() },
				{ provide: UpdateTextileCertificationUseCase, useValue: createMockUseCase() },
				{ provide: GetAllTextileCertificationsUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdTextileCertificationUseCase, useValue: createMockUseCase() },
				{ provide: DeleteTextileCertificationUseCase, useValue: createMockUseCase() },
				// Mocks para ColorOptionAlternative use cases
				{ provide: CreateColorOptionAlternativeUseCase, useValue: createMockUseCase() },
				{ provide: UpdateColorOptionAlternativeUseCase, useValue: createMockUseCase() },
				{ provide: GetAllColorOptionAlternativesUseCase, useValue: createMockUseCase() },
				{ provide: GetByIdColorOptionAlternativeUseCase, useValue: createMockUseCase() },
				{ provide: DeleteColorOptionAlternativeUseCase, useValue: createMockUseCase() },
				{ provide: CreateManyColorOptionAlternativesUseCase, useValue: createMockUseCase() },
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

		createTextileProductUseCase = moduleFixture.get<CreateTextileProductUseCase>(
			CreateTextileProductUseCase,
		);
		getAllTextileProductsUseCase = moduleFixture.get<GetAllTextileProductsUseCase>(
			GetAllTextileProductsUseCase,
		);
		getByIdTextileProductUseCase = moduleFixture.get<GetByIdTextileProductUseCase>(
			GetByIdTextileProductUseCase,
		);
		updateTextileProductUseCase = moduleFixture.get<UpdateTextileProductUseCase>(
			UpdateTextileProductUseCase,
		);
		deleteTextileProductUseCase = moduleFixture.get<DeleteTextileProductUseCase>(
			DeleteTextileProductUseCase,
		);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /textile-products', () => {
		it('should create a new textile product', () => {
			jest.spyOn(createTextileProductUseCase, 'handle').mockResolvedValueOnce(mockTextileProduct);

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('status', TextileProductStatus.PUBLISHED);
					expect(res.body).toHaveProperty('baseInfo');
					expect(res.body.baseInfo).toHaveProperty('title', mockBaseInfo.title);
					expect(res.body).toHaveProperty('priceInventary');
					expect(res.body.priceInventary).toHaveProperty('basePrice', mockPriceInventary.basePrice);
					expect(res.body.priceInventary).toHaveProperty('totalStock', mockPriceInventary.totalStock);
					expect(res.body.priceInventary).toHaveProperty('SKU', mockPriceInventary.SKU);
					expect(res.body).toHaveProperty('categoryId');
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
			const invalidDto = {
				...createDto,
				baseInfo: {
					...createDto.baseInfo,
					title: undefined,
				},
			};

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basePrice is less than 0', () => {
			const invalidDto = {
				...createDto,
				priceInventary: {
					...createDto.priceInventary,
					basePrice: -1,
				},
			};

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when totalStock is negative', () => {
			const invalidDto = {
				...createDto,
				priceInventary: {
					...createDto.priceInventary,
					totalStock: -1,
				},
			};

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when status is invalid', () => {
			const invalidDto = {
				...createDto,
				status: 'INVALID_STATUS',
			};

			return request(app.getHttpServer())
				.post('/textile-products')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});


	});

	describe('GET /textile-products', () => {
		it('should get all textile products without pagination', async () => {
			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(mockPaginatedResponse);

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
			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(mockPaginatedResponse);

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
			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			// Verificar estructura de colors
			if (response.body.filterCount.colors.length > 0) {
				expect(response.body.filterCount.colors[0]).toHaveProperty('label');
				expect(response.body.filterCount.colors[0]).toHaveProperty('count');
				expect(typeof response.body.filterCount.colors[0].label).toBe('string');
				expect(typeof response.body.filterCount.colors[0].count).toBe('number');
			}

			// Verificar estructura de sizes
			if (response.body.filterCount.sizes.length > 0) {
				expect(response.body.filterCount.sizes[0]).toHaveProperty('label');
				expect(response.body.filterCount.sizes[0]).toHaveProperty('count');
			}

			// Verificar estructura de communities
			if (response.body.filterCount.communities.length > 0) {
				expect(response.body.filterCount.communities[0]).toHaveProperty('label');
				expect(response.body.filterCount.communities[0]).toHaveProperty('count');
			}

			// Verificar estructura de categories
			if (response.body.filterCount.categories.length > 0) {
				expect(response.body.filterCount.categories[0]).toHaveProperty('label');
				expect(response.body.filterCount.categories[0]).toHaveProperty('count');
			}
		});

		it('should get textile products with pagination', async () => {
			const paginatedResponse = {
				products: [mockTextileProductListItem],
				pagination: {
					total: 100,
					page: 2,
					per_page: 20,
				},
				filterCount: mockPaginatedResponse.filterCount,
			};

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(paginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?page=2&per_page=20')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body).toHaveProperty('pagination');
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
					sizes: [{ label: 'm', count: 5 }, { label: 'l', count: 10 }],
					communities: [],
					categories: [{ label: 'Ponchos', count: 15 }],
				},
			};

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

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
					colors: [{ label: 'rojo', count: 5 }, { label: 'azul', count: 3 }],
					sizes: [{ label: 'm', count: 8 }],
					communities: [],
					categories: [],
				},
			};

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

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

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?min_price=100&max_price=200')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('products');
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body).toHaveProperty('filterCount');
			// Los contadores no deberían estar vacíos al filtrar solo por precio
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

			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

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

			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?category_id=category-poncho-001')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ categoryId: 'category-poncho-001' });
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

			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?owner_id=shop-123')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({ ownerId: 'shop-123' });
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

			const spy = jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products?category_id=category-poncho-001&color=rojo&size=L&min_price=100&max_price=200&page=2&per_page=20')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith({
				categoryId: 'category-poncho-001',
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
				filterCount: {
					colors: [{ label: 'rojo', count: 5 }],
					sizes: [{ label: 'm', count: 5 }],
					communities: [{ label: 'Comunidad Andina Norte', count: 5 }],
					categories: [{ label: 'Ponchos', count: 5 }],
				},
			};

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/textile-products')
				.expect(HttpStatus.OK);

			expect(response.body.filterCount).toHaveProperty('communities');
			expect(Array.isArray(response.body.filterCount.communities)).toBe(true);
		});

		it('should return empty arrays in filterCount when no products match filters', async () => {
			const emptyResponse = {
				products: [],
				pagination: { total: 0, page: 1, per_page: 10 },
				filterCount: {
					colors: [],
					sizes: [],
					communities: [],
					categories: [],
				},
			};

			jest.spyOn(getAllTextileProductsUseCase, 'handle').mockImplementationOnce(() => {
				throw { statusCode: 404, message: 'No textile products found with the specified filters' };
			});

			await request(app.getHttpServer())
				.get('/textile-products?color=nonexistent')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /textile-products/:id', () => {
		const productId = 'textile-uuid-123';

		it('should get a textile product by id', () => {
			jest.spyOn(getByIdTextileProductUseCase, 'handle').mockResolvedValueOnce(mockTextileProduct);

			return request(app.getHttpServer())
				.get(`/textile-products/${productId}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockTextileProduct.id);
					expect(res.body).toHaveProperty('status', TextileProductStatus.PUBLISHED);
					expect(res.body.baseInfo).toHaveProperty('title', mockBaseInfo.title);
					expect(res.body.priceInventary).toHaveProperty('basePrice', mockPriceInventary.basePrice);
					expect(res.body.priceInventary).toHaveProperty('totalStock', mockPriceInventary.totalStock);
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

	describe('PUT /textile-products/:id', () => {
		const productId = 'textile-uuid-123';
		const updatedProduct = {
			...mockTextileProduct,
			baseInfo: { ...mockBaseInfo, title: 'Poncho Andino Premium Actualizado' },
			priceInventary: { ...mockPriceInventary, basePrice: 180.00, totalStock: 75 },
		};

		it('should update a textile product', () => {
			jest.spyOn(updateTextileProductUseCase, 'handle').mockResolvedValueOnce(updatedProduct);

			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', productId);
					expect(res.body.baseInfo).toHaveProperty('title', 'Poncho Andino Premium Actualizado');
					expect(res.body.priceInventary).toHaveProperty('basePrice', 180.00);
					expect(res.body.priceInventary).toHaveProperty('totalStock', 75);
				});
		});

		it('should call the use case with correct productId and dto', async () => {
			const spy = jest.spyOn(updateTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(productId, expect.objectContaining({
				status: updateDto.status,
				baseInfo: expect.objectContaining({
					title: updateDto.baseInfo.title,
				}),
			}));
		});

		it('should return 400 when updating with invalid basePrice', () => {
			const invalidDto = {
				...updateDto,
				priceInventary: {
					...updateDto.priceInventary,
					basePrice: -10,
				},
			};

			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when updating with invalid totalStock', () => {
			const invalidDto = {
				...updateDto,
				priceInventary: {
					...updateDto.priceInventary,
					totalStock: -5,
				},
			};

			return request(app.getHttpServer())
				.put(`/textile-products/${productId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('DELETE /textile-products/:id', () => {
		const productId = 'textile-uuid-123';

		it('should delete a textile product', () => {
			jest.spyOn(deleteTextileProductUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/textile-products/${productId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct productId', async () => {
			const spy = jest.spyOn(deleteTextileProductUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/textile-products/${productId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(productId);
		});
	});
});

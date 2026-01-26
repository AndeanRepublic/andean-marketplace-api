import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { VariantController } from '../src/andean/infra/controllers/variantControllers/variant.controller';
import { CreateVariantUseCase } from '../src/andean/app/use_cases/variant/CreateVariantUseCase';
import { CreateManyVariantsUseCase } from '../src/andean/app/use_cases/variant/CreateManyVariantsUseCase';
import { GetAllVariantsUseCase } from '../src/andean/app/use_cases/variant/GetAllVariantsUseCase';
import { GetVariantByIdUseCase } from '../src/andean/app/use_cases/variant/GetVariantByIdUseCase';
import { GetVariantsByProductIdUseCase } from '../src/andean/app/use_cases/variant/GetVariantsByProductIdUseCase';
import { UpdateVariantUseCase } from '../src/andean/app/use_cases/variant/UpdateVariantUseCase';
import { DeleteVariantUseCase } from '../src/andean/app/use_cases/variant/DeleteVariantUseCase';
import { DeleteVariantsByProductIdUseCase } from '../src/andean/app/use_cases/variant/DeleteVariantsByProductIdUseCase';
import { SyncVariantsUseCase } from '../src/andean/app/use_cases/variant/SyncVariantsUseCase';
import { ProductType } from '../src/andean/domain/enums/ProductType';

describe('VariantController (e2e)', () => {
	let app: INestApplication;
	let createVariantUseCase: jest.Mocked<CreateVariantUseCase>;
	let createManyVariantsUseCase: jest.Mocked<CreateManyVariantsUseCase>;
	let getAllVariantsUseCase: jest.Mocked<GetAllVariantsUseCase>;
	let getVariantByIdUseCase: jest.Mocked<GetVariantByIdUseCase>;
	let getVariantsByProductIdUseCase: jest.Mocked<GetVariantsByProductIdUseCase>;
	let updateVariantUseCase: jest.Mocked<UpdateVariantUseCase>;
	let deleteVariantUseCase: jest.Mocked<DeleteVariantUseCase>;
	let deleteVariantsByProductIdUseCase: jest.Mocked<DeleteVariantsByProductIdUseCase>;
	let syncVariantsUseCase: jest.Mocked<SyncVariantsUseCase>;

	// Mock data
	const mockVariant = {
		id: 'variant-123',
		productId: 'product-123',
		productType: ProductType.TEXTILE,
		combination: { color: 'Red', size: 'M' },
		price: 50.0,
		stock: 10,
		createdAt: new Date('2026-01-26T18:42:52.753Z'),
		updatedAt: new Date('2026-01-26T18:42:52.753Z'),
	} as any; // Use 'as any' to avoid TypeScript strict checking in tests

	const mockVariantArray = [mockVariant];

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [VariantController],
			providers: [
				{
					provide: CreateVariantUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: CreateManyVariantsUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: GetAllVariantsUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: GetVariantByIdUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: GetVariantsByProductIdUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: UpdateVariantUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: DeleteVariantUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: DeleteVariantsByProductIdUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: SyncVariantsUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		// Get mocked services
		createVariantUseCase = moduleFixture.get(CreateVariantUseCase);
		createManyVariantsUseCase = moduleFixture.get(CreateManyVariantsUseCase);
		getAllVariantsUseCase = moduleFixture.get(GetAllVariantsUseCase);
		getVariantByIdUseCase = moduleFixture.get(GetVariantByIdUseCase);
		getVariantsByProductIdUseCase = moduleFixture.get(GetVariantsByProductIdUseCase);
		updateVariantUseCase = moduleFixture.get(UpdateVariantUseCase);
		deleteVariantUseCase = moduleFixture.get(DeleteVariantUseCase);
		deleteVariantsByProductIdUseCase = moduleFixture.get(DeleteVariantsByProductIdUseCase);
		syncVariantsUseCase = moduleFixture.get(SyncVariantsUseCase);
	});

	afterEach(async () => {
		await app.close();
	});

	describe('POST /variants', () => {
		it('should create a new variant', async () => {
			const createVariantDto = {
				productId: 'product-123',
				productType: ProductType.TEXTILE,
				combination: { color: 'Red', size: 'M' },
				price: 50.0,
				stock: 10,
			};

			createVariantUseCase.execute.mockResolvedValue(mockVariant);

			const response = await request(app.getHttpServer())
				.post('/variants')
				.send(createVariantDto)
				.expect(201);

			expect(response.body).toEqual({
				...mockVariant,
				createdAt: '2026-01-26T18:42:52.753Z',
				updatedAt: '2026-01-26T18:42:52.753Z',
			});
			expect(createVariantUseCase.execute).toHaveBeenCalledWith(createVariantDto);
		});

		it('should return 400 for invalid data', async () => {
			const invalidDto = {
				productId: '', // Invalid: empty string
				productType: 'INVALID_TYPE',
				price: -10, // Invalid: negative price
			};

			await request(app.getHttpServer())
				.post('/variants')
				.send(invalidDto)
				.expect(400);
		});
	});

	describe('POST /variants/many', () => {
		it('should create multiple variants', async () => {
			const createManyDto = {
				variants: [
					{
						productId: 'product-123',
						productType: ProductType.TEXTILE,
						combination: { color: 'Red', size: 'M' },
						price: 50.0,
						stock: 10,
					},
					{
						productId: 'product-123',
						productType: ProductType.TEXTILE,
						combination: { color: 'Blue', size: 'L' },
						price: 55.0,
						stock: 5,
					},
				],
			};

			createManyVariantsUseCase.execute.mockResolvedValue(mockVariantArray);

			const response = await request(app.getHttpServer())
				.post('/variants/many')
				.send(createManyDto)
				.expect(201);

			expect(response.body).toEqual([
				{
					...mockVariant,
					createdAt: '2026-01-26T18:42:52.753Z',
					updatedAt: '2026-01-26T18:42:52.753Z',
				},
			]);
			expect(createManyVariantsUseCase.execute).toHaveBeenCalledWith(createManyDto);
		});
	});

	describe('PUT /variants/sync', () => {
		it('should sync variants for a product', async () => {
			const syncDto = {
				productId: 'product-123',
				productType: ProductType.TEXTILE,
				variants: [
					{
						combination: { color: 'Red', size: 'M' },
						price: 50.0,
						stock: 10,
					},
				],
			};

			syncVariantsUseCase.execute.mockResolvedValue(mockVariantArray);

			const response = await request(app.getHttpServer())
				.put('/variants/sync')
				.send(syncDto)
				.expect(200);

			expect(response.body).toEqual([
				{
					...mockVariant,
					createdAt: '2026-01-26T18:42:52.753Z',
					updatedAt: '2026-01-26T18:42:52.753Z',
				},
			]);
			expect(syncVariantsUseCase.execute).toHaveBeenCalledWith(syncDto);
		});
	});

	describe('GET /variants', () => {
		it('should return all variants', async () => {
			getAllVariantsUseCase.execute.mockResolvedValue(mockVariantArray);

			const response = await request(app.getHttpServer())
				.get('/variants')
				.expect(200);

			expect(response.body).toEqual([
				{
					...mockVariant,
					createdAt: '2026-01-26T18:42:52.753Z',
					updatedAt: '2026-01-26T18:42:52.753Z',
				},
			]);
			expect(getAllVariantsUseCase.execute).toHaveBeenCalled();
		});
	});

	describe('GET /variants/product/:productId', () => {
		it('should return variants for a specific product', async () => {
			const productId = 'product-123';
			getVariantsByProductIdUseCase.execute.mockResolvedValue(mockVariantArray);

			const response = await request(app.getHttpServer())
				.get(`/variants/product/${productId}`)
				.expect(200);

			expect(response.body).toEqual([
				{
					...mockVariant,
					createdAt: '2026-01-26T18:42:52.753Z',
					updatedAt: '2026-01-26T18:42:52.753Z',
				},
			]);
			expect(getVariantsByProductIdUseCase.execute).toHaveBeenCalledWith(productId);
		});
	});

	describe('GET /variants/:id', () => {
		it('should return a specific variant by id', async () => {
			const variantId = 'variant-123';
			getVariantByIdUseCase.execute.mockResolvedValue(mockVariant);

			const response = await request(app.getHttpServer())
				.get(`/variants/${variantId}`)
				.expect(200);

			expect(response.body).toEqual({
				...mockVariant,
				createdAt: '2026-01-26T18:42:52.753Z',
				updatedAt: '2026-01-26T18:42:52.753Z',
			});
			expect(getVariantByIdUseCase.execute).toHaveBeenCalledWith(variantId);
		});

		it('should return 404 for non-existent variant', async () => {
			const variantId = 'non-existent-id';
			getVariantByIdUseCase.execute.mockRejectedValue(
				new NotFoundException('Variant with id non-existent-id not found'),
			);

			await request(app.getHttpServer())
				.get(`/variants/${variantId}`)
				.expect(404);
		});
	});

	describe('PUT /variants/:id', () => {
		it('should update a variant', async () => {
			const variantId = 'variant-123';
			const updateDto = {
				price: 60.0,
				stock: 15,
			};
			const updatedVariant = { ...mockVariant, ...updateDto } as any;

			updateVariantUseCase.execute.mockResolvedValue(updatedVariant);

			const response = await request(app.getHttpServer())
				.put(`/variants/${variantId}`)
				.send(updateDto)
				.expect(200);

			expect(response.body).toEqual({
				...updatedVariant,
				createdAt: '2026-01-26T18:42:52.753Z',
				updatedAt: '2026-01-26T18:42:52.753Z',
			});
			expect(updateVariantUseCase.execute).toHaveBeenCalledWith(variantId, updateDto);
		});
	});

	describe('DELETE /variants/:id', () => {
		it('should delete a variant', async () => {
			const variantId = 'variant-123';
			deleteVariantUseCase.execute.mockResolvedValue();

			await request(app.getHttpServer())
				.delete(`/variants/${variantId}`)
				.expect(204);

			expect(deleteVariantUseCase.execute).toHaveBeenCalledWith(variantId);
		});
	});

	describe('DELETE /variants/product/:productId', () => {
		it('should delete all variants for a product', async () => {
			const productId = 'product-123';
			deleteVariantsByProductIdUseCase.execute.mockResolvedValue(true);

			await request(app.getHttpServer())
				.delete(`/variants/product/${productId}`)
				.expect(204);

			expect(deleteVariantsByProductIdUseCase.execute).toHaveBeenCalledWith(productId);
		});
	});
});
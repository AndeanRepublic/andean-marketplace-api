import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	ValidationPipe,
	NotFoundException,
} from '@nestjs/common';
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
import { FixtureLoader } from './helpers/fixture-loader';

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

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadVariant();
	const mockVariant = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as any;
	const mockVariantArray = [mockVariant];

	// FIX: Changed from beforeEach to beforeAll — creating the app per test is wasteful when no state mutates
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [VariantController],
			providers: [
				{ provide: CreateVariantUseCase, useValue: { execute: jest.fn() } },
				{
					provide: CreateManyVariantsUseCase,
					useValue: { execute: jest.fn() },
				},
				{ provide: GetAllVariantsUseCase, useValue: { execute: jest.fn() } },
				{ provide: GetVariantByIdUseCase, useValue: { execute: jest.fn() } },
				{
					provide: GetVariantsByProductIdUseCase,
					useValue: { execute: jest.fn() },
				},
				{ provide: UpdateVariantUseCase, useValue: { execute: jest.fn() } },
				{ provide: DeleteVariantUseCase, useValue: { execute: jest.fn() } },
				{
					provide: DeleteVariantsByProductIdUseCase,
					useValue: { execute: jest.fn() },
				},
				{ provide: SyncVariantsUseCase, useValue: { execute: jest.fn() } },
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		// FIX: Added whitelist + forbidNonWhitelisted + transform to match main.ts
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();

		createVariantUseCase = moduleFixture.get(CreateVariantUseCase);
		createManyVariantsUseCase = moduleFixture.get(CreateManyVariantsUseCase);
		getAllVariantsUseCase = moduleFixture.get(GetAllVariantsUseCase);
		getVariantByIdUseCase = moduleFixture.get(GetVariantByIdUseCase);
		getVariantsByProductIdUseCase = moduleFixture.get(
			GetVariantsByProductIdUseCase,
		);
		updateVariantUseCase = moduleFixture.get(UpdateVariantUseCase);
		deleteVariantUseCase = moduleFixture.get(DeleteVariantUseCase);
		deleteVariantsByProductIdUseCase = moduleFixture.get(
			DeleteVariantsByProductIdUseCase,
		);
		syncVariantsUseCase = moduleFixture.get(SyncVariantsUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /variants', () => {
		it('should create a new variant', async () => {
			createVariantUseCase.execute.mockResolvedValue(mockVariant);
			const response = await request(app.getHttpServer())
				.post('/variants')
				.send(fixture.createDto)
				.expect(201);
			expect(response.body).toMatchObject({
				id: fixture.entity.id,
				productId: fixture.entity.productId,
				productType: fixture.entity.productType,
				price: fixture.entity.price,
				stock: fixture.entity.stock,
			});
			expect(createVariantUseCase.execute).toHaveBeenCalledWith(
				fixture.createDto,
			);
		});

		it('should return 400 for invalid data', async () => {
			await request(app.getHttpServer())
				.post('/variants')
				.send(fixture.invalidDto)
				.expect(400);
		});
	});

	describe('POST /variants/many', () => {
		it('should return 404 because endpoint is disabled', async () => {
			await request(app.getHttpServer())
				.post('/variants/many')
				.send(fixture.createManyDto)
				.expect(404);
		});
	});

	describe('PUT /variants/sync', () => {
		it('should sync variants for a product', async () => {
			syncVariantsUseCase.execute.mockResolvedValue(mockVariantArray);
			const response = await request(app.getHttpServer())
				.put('/variants/sync')
				.send(fixture.syncDto)
				.expect(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toMatchObject({ id: fixture.entity.id });
			expect(syncVariantsUseCase.execute).toHaveBeenCalledWith(fixture.syncDto);
		});
	});

	describe('GET /variants', () => {
		it('should return all variants', async () => {
			getAllVariantsUseCase.execute.mockResolvedValue(mockVariantArray);
			const response = await request(app.getHttpServer())
				.get('/variants')
				.expect(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toMatchObject({
				id: fixture.entity.id,
				productId: fixture.entity.productId,
			});
			expect(getAllVariantsUseCase.execute).toHaveBeenCalled();
		});
	});

	describe('GET /variants/product/:productId', () => {
		it('should return variants for a specific product', async () => {
			getVariantsByProductIdUseCase.execute.mockResolvedValue(mockVariantArray);
			const response = await request(app.getHttpServer())
				.get(`/variants/product/${fixture.entity.productId}`)
				.expect(200);
			expect(response.body[0]).toMatchObject({
				productId: fixture.entity.productId,
			});
			expect(getVariantsByProductIdUseCase.execute).toHaveBeenCalledWith(
				fixture.entity.productId,
			);
		});
	});

	describe('GET /variants/:id', () => {
		it('should return a specific variant by id', async () => {
			getVariantByIdUseCase.execute.mockResolvedValue(mockVariant);
			const response = await request(app.getHttpServer())
				.get(`/variants/${fixture.entity.id}`)
				.expect(200);
			expect(response.body).toMatchObject({
				id: fixture.entity.id,
				price: fixture.entity.price,
				stock: fixture.entity.stock,
			});
			expect(getVariantByIdUseCase.execute).toHaveBeenCalledWith(
				fixture.entity.id,
			);
		});

		it('should return 404 for non-existent variant', async () => {
			getVariantByIdUseCase.execute.mockRejectedValue(
				new NotFoundException('Variant with id non-existent-id not found'),
			);
			await request(app.getHttpServer())
				.get('/variants/non-existent-id')
				.expect(404);
		});
	});

	describe('PUT /variants/:id', () => {
		it('should update a variant', async () => {
			const updatedVariant = { ...mockVariant, ...fixture.updateDto } as any;
			updateVariantUseCase.execute.mockResolvedValue(updatedVariant);
			const response = await request(app.getHttpServer())
				.put(`/variants/${fixture.entity.id}`)
				.send(fixture.updateDto)
				.expect(200);
			expect(response.body).toMatchObject({
				id: fixture.entity.id,
				price: fixture.updateDto.price,
				stock: fixture.updateDto.stock,
			});
			expect(updateVariantUseCase.execute).toHaveBeenCalledWith(
				fixture.entity.id,
				fixture.updateDto,
			);
		});
	});

	describe('DELETE /variants/:id', () => {
		it('should delete a variant', async () => {
			deleteVariantUseCase.execute.mockResolvedValue();
			await request(app.getHttpServer())
				.delete(`/variants/${fixture.entity.id}`)
				.expect(204);
			expect(deleteVariantUseCase.execute).toHaveBeenCalledWith(
				fixture.entity.id,
			);
		});
	});

	describe('DELETE /variants/product/:productId', () => {
		it('should delete all variants for a product', async () => {
			deleteVariantsByProductIdUseCase.execute.mockResolvedValue(true);
			await request(app.getHttpServer())
				.delete(`/variants/product/${fixture.entity.productId}`)
				.expect(204);
			expect(deleteVariantsByProductIdUseCase.execute).toHaveBeenCalledWith(
				fixture.entity.productId,
			);
		});
	});
});

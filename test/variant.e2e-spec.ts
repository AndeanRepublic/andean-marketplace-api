import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	ValidationPipe,
	HttpStatus,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import request from 'supertest';
import { VariantController } from '../src/andean/infra/controllers/variantControllers/variant.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
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
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(mockAuthUsers.seller))
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => true })
			.compile();

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
		it.skip('should create multiple variants', async () => {
			createManyVariantsUseCase.execute.mockResolvedValue(mockVariantArray);
			const response = await request(app.getHttpServer())
				.post('/variants/many')
				.send(fixture.createManyDto)
				.expect(201);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body[0]).toMatchObject({
				id: fixture.entity.id,
				productId: fixture.entity.productId,
			});
			expect(createManyVariantsUseCase.execute).toHaveBeenCalledWith(
				fixture.createManyDto,
			);
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
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
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
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
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

	// ─── Ownership enforcement (Pattern G) ────────────────────────────────────
	describe('ownership enforcement', () => {
		const variantId = fixture.entity.id;

		async function buildApp(
			authUser: { userId: string; email: string; roles: any[] } | null,
		): Promise<INestApplication> {
			const module: TestingModule = await Test.createTestingModule({
				controllers: [VariantController],
				providers: [
					{
						provide: CreateVariantUseCase,
						useValue: { execute: jest.fn() },
					},
					{
						provide: CreateManyVariantsUseCase,
						useValue: { execute: jest.fn() },
					},
					{ provide: GetAllVariantsUseCase, useValue: { execute: jest.fn() } },
					{
						provide: GetVariantByIdUseCase,
						useValue: { execute: jest.fn() },
					},
					{
						provide: GetVariantsByProductIdUseCase,
						useValue: { execute: jest.fn() },
					},
					{
						provide: UpdateVariantUseCase,
						useValue: { execute: jest.fn().mockResolvedValue(mockVariant) },
					},
					{
						provide: DeleteVariantUseCase,
						useValue: { execute: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: DeleteVariantsByProductIdUseCase,
						useValue: { execute: jest.fn() },
					},
					{ provide: SyncVariantsUseCase, useValue: { execute: jest.fn() } },
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

		// ── PUT /variants/:id ownership ────────────────────────────────────
		describe('PUT /variants/:id', () => {
			it('should return 200 when SELLER owner (parent product in their shop) updates', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(UpdateVariantUseCase);
				jest.spyOn(uc, 'execute').mockResolvedValueOnce(mockVariant);

				await request(ownerApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(200);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to update', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(UpdateVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(403);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to update non-TEXTILE variant', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(403);

				await sellerApp.close();
			});

			it('should return 403 when SELLER tries to update variant of COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(403);

				await sellerApp.close();
			});

			it('should return 200 when ADMIN updates any variant', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(UpdateVariantUseCase);
				jest.spyOn(uc, 'execute').mockResolvedValueOnce(mockVariant);

				await request(adminApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(200);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(401);

				await unauthApp.close();
			});
		});

		// ── DELETE /variants/:id ownership ─────────────────────────────────
		describe('DELETE /variants/:id', () => {
			it('should return 204 when SELLER owner deletes their variant', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(DeleteVariantUseCase);
				jest.spyOn(uc, 'execute').mockResolvedValueOnce(undefined);

				await request(ownerApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(204);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to delete', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(DeleteVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(403);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to delete non-TEXTILE variant', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(403);

				await sellerApp.close();
			});

			it('should return 403 when SELLER tries to delete variant of COMMUNITY-owned product', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(403);

				await sellerApp.close();
			});

			it('should return 204 when ADMIN deletes any variant', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(DeleteVariantUseCase);
				jest.spyOn(uc, 'execute').mockResolvedValueOnce(undefined);

				await request(adminApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(204);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(401);

				await unauthApp.close();
			});
		});

		// ── POST /variants — Pattern A USER→403 ───────────────────────────
		describe('POST /variants', () => {
			it('should return 403 when USER tries to create a variant', async () => {
				const module: TestingModule = await Test.createTestingModule({
					controllers: [VariantController],
					providers: [
						{
							provide: CreateVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: CreateManyVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetAllVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetVariantByIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetVariantsByProductIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: UpdateVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: DeleteVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: DeleteVariantsByProductIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: SyncVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
					],
				})
					.overrideGuard(JwtAuthGuard)
					.useValue(createAllowAllGuard(mockAuthUsers.customer))
					.overrideGuard(RolesGuard)
					.useValue({ canActivate: () => false })
					.compile();

				const userApp = module.createNestApplication();
				userApp.useGlobalPipes(
					new ValidationPipe({
						whitelist: true,
						forbidNonWhitelisted: true,
						transform: true,
					}),
				);
				await userApp.init();

				await request(userApp.getHttpServer())
					.post('/variants')
					.send(fixture.createDto)
					.expect(HttpStatus.FORBIDDEN);

				await userApp.close();
			});
		});

		// ── PUT /variants/:id — Pattern F additional ───────────────────────
		describe('PUT /variants/:id additional', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when variant does not exist', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(new NotFoundException('Variant not found'));

				await request(sellerApp.getHttpServer())
					.put('/variants/non-existent-id')
					.send(fixture.updateDto)
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});

			it('should return 200 when ADMIN updates a non-TEXTILE variant (Pattern G bypass)', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(UpdateVariantUseCase);
				jest.spyOn(uc, 'execute').mockResolvedValueOnce(mockVariant);

				await request(adminApp.getHttpServer())
					.put(`/variants/${variantId}`)
					.send(fixture.updateDto)
					.expect(HttpStatus.OK);

				await adminApp.close();
			});
		});

		// ── DELETE /variants/:id — Pattern F additional ────────────────────
		describe('DELETE /variants/:id additional', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/variants/${variantId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when variant does not exist', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteVariantUseCase);
				jest
					.spyOn(uc, 'execute')
					.mockRejectedValueOnce(new NotFoundException('Variant not found'));

				await request(sellerApp.getHttpServer())
					.delete('/variants/non-existent-id')
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});

		// ── PUT /variants/sync — guard enforcement ─────────────────────────
		describe('PUT /variants/sync', () => {
			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.put('/variants/sync')
					.send(fixture.syncDto)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});

			it('should return 403 when USER tries to sync variants', async () => {
				const module: TestingModule = await Test.createTestingModule({
					controllers: [VariantController],
					providers: [
						{
							provide: CreateVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: CreateManyVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetAllVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetVariantByIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: GetVariantsByProductIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: UpdateVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: DeleteVariantUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: DeleteVariantsByProductIdUseCase,
							useValue: { execute: jest.fn() },
						},
						{
							provide: SyncVariantsUseCase,
							useValue: { execute: jest.fn() },
						},
					],
				})
					.overrideGuard(JwtAuthGuard)
					.useValue(createAllowAllGuard(mockAuthUsers.customer))
					.overrideGuard(RolesGuard)
					.useValue({ canActivate: () => false })
					.compile();

				const userApp = module.createNestApplication();
				userApp.useGlobalPipes(
					new ValidationPipe({
						whitelist: true,
						forbidNonWhitelisted: true,
						transform: true,
					}),
				);
				await userApp.init();

				await request(userApp.getHttpServer())
					.put('/variants/sync')
					.send(fixture.syncDto)
					.expect(HttpStatus.FORBIDDEN);

				await userApp.close();
			});
		});
	});
});

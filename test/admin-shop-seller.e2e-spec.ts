import { Test, TestingModule } from '@nestjs/testing';
import {
	ConflictException,
	HttpStatus,
	INestApplication,
	NotFoundException,
	ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { ShopController } from '../src/andean/infra/controllers/shop/shop.controller';
import { AdminController } from '../src/andean/infra/controllers/admin.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { ListAllShopsUseCase } from '../src/andean/app/use_cases/shop/ListAllShopsUseCase';
import { GetShopByIdUseCase } from '../src/andean/app/use_cases/shop/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from '../src/andean/app/use_cases/shop/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from '../src/andean/app/use_cases/shop/GetShopsBySellerIdUseCase';
import { CreateShopUseCase } from '../src/andean/app/use_cases/shop/CreateShopUseCase';
import { DeleteShopUseCase } from '../src/andean/app/use_cases/shop/DeleteShopUseCase';
import { UpdateShopUseCase } from '../src/andean/app/use_cases/shop/UpdateShopUseCase';
import { UpdateShopStatusUseCase } from '../src/andean/app/use_cases/shop/UpdateShopStatusUseCase';
import { CreateSellerApplicationUseCase } from '../src/andean/app/use_cases/shop/CreateSellerApplicationUseCase';
import { UpdateShopVisibilityUseCase } from '../src/andean/app/use_cases/shop/UpdateShopVisibilityUseCase';
import { MediaUrlResolver } from '../src/andean/infra/services/media/MediaUrlResolver';
import { CreateAdminSellerUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerUseCase';
import { LookupAccountByEmailUseCase } from '../src/andean/app/use_cases/users/LookupAccountByEmailUseCase';
import { CreateAdminSellerByEmailUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerByEmailUseCase';
import { CreateAdminSellerWithAccountUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerWithAccountUseCase';
import { LinkShopToSellerUseCase } from '../src/andean/app/use_cases/shop/LinkShopToSellerUseCase';
import { UnlinkShopFromSellerUseCase } from '../src/andean/app/use_cases/shop/UnlinkShopFromSellerUseCase';
import { ListShopsForAdminUseCase } from '../src/andean/app/use_cases/shop/ListShopsForAdminUseCase';
import { ListAvailableSellersUseCase } from '../src/andean/app/use_cases/shop/ListAvailableSellersUseCase';
import { ListAvailableShopsUseCase } from '../src/andean/app/use_cases/shop/ListAvailableShopsUseCase';
import { ListPendingSellerApplicationsUseCase } from '../src/andean/app/use_cases/users/ListPendingSellerApplicationsUseCase';
import { GetSellerApplicationDetailUseCase } from '../src/andean/app/use_cases/users/GetSellerApplicationDetailUseCase';
import { ReviewSellerApplicationUseCase } from '../src/andean/app/use_cases/users/ReviewSellerApplicationUseCase';
import { UpdateAccountStatusUseCase } from '../src/andean/app/use_cases/users/UpdateAccountStatusUseCase';
import { GetAllCustomerUseCase } from '../src/andean/app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from '../src/andean/app/use_cases/users/GetAllSellersUseCase';
import { ShopStatus } from '../src/andean/domain/enums/ShopStatus';
import { SellerStatus } from '../src/andean/domain/enums/SellerStatus';
import { ShopCategory } from '../src/andean/domain/enums/ShopCategory';
import { PersonType } from '../src/andean/domain/enums/PersonType';
import { AccountRole } from '../src/andean/domain/enums/AccountRole';
import { AccountStatus } from '../src/andean/domain/enums/AccountStatus';

const userId = '507f1f77bcf86cd799439011';
const sellerProfileId = '507f1f77bcf86cd799439012';
const shopId = '507f1f77bcf86cd799439013';
const orphanShopId = '507f1f77bcf86cd799439014';

describe('FORMA 2 — Admin shops, sellers y enlace (e2e)', () => {
	const createShopBody = {
		name: 'Tienda Admin',
		categories: [ShopCategory.UNKNOWN],
	};

	const createSellerBody = {
		userId,
		typePerson: PersonType.NATURAL,
		numberDocument: '87654321',
		name: 'Vendedor Admin',
		address: 'Lima',
		phoneNumber: '+51911111111',
	};

	const sellerEmail = 'vendedor@example.com';

	const createSellerByEmailBody = {
		email: sellerEmail,
		typePerson: PersonType.NATURAL,
		numberDocument: '87654321',
		name: 'Vendedor Admin',
		address: 'Lima',
		phoneNumber: '+51911111111',
	};

	const createSellerWithAccountBody = {
		email: 'nuevo@example.com',
		password: 'SecurePass123!',
		accountName: 'Nuevo Vendedor',
		typePerson: PersonType.NATURAL,
		numberDocument: '11223344',
		name: 'Nuevo Vendedor Legal',
		address: 'Cusco',
		phoneNumber: '+51922222222',
	};

	async function buildShopApp(
		authUser: { userId: string; roles: AccountRole[] } = mockAuthUsers.admin,
	) {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ShopController],
			providers: [
				{ provide: ListAllShopsUseCase, useValue: { handle: jest.fn() } },
				{ provide: GetShopByIdUseCase, useValue: { handle: jest.fn() } },
				{ provide: GetShopsByCategoryUseCase, useValue: { handle: jest.fn() } },
				{ provide: GetShopsBySellerIdUseCase, useValue: { handle: jest.fn() } },
				{ provide: CreateShopUseCase, useValue: { handle: jest.fn() } },
				{ provide: DeleteShopUseCase, useValue: { handle: jest.fn() } },
				{ provide: UpdateShopUseCase, useValue: { handle: jest.fn() } },
				{ provide: UpdateShopStatusUseCase, useValue: { handle: jest.fn() } },
				{
					provide: CreateSellerApplicationUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: UpdateShopVisibilityUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: MediaUrlResolver,
					useValue: {
						resolveUrl: jest.fn().mockResolvedValue(''),
						resolveUrls: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(authUser as any))
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

	async function buildAdminApp() {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminController],
			providers: [
				{ provide: GetAllCustomerUseCase, useValue: { handle: jest.fn() } },
				{ provide: GetAllSellersUseCase, useValue: { handle: jest.fn() } },
				{ provide: UpdateAccountStatusUseCase, useValue: { handle: jest.fn() } },
				{
					provide: ReviewSellerApplicationUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: CreateAdminSellerUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: LookupAccountByEmailUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: CreateAdminSellerByEmailUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: CreateAdminSellerWithAccountUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: LinkShopToSellerUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: UnlinkShopFromSellerUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ListShopsForAdminUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ListAvailableSellersUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ListAvailableShopsUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ListPendingSellerApplicationsUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: GetSellerApplicationDetailUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: MediaUrlResolver,
					useValue: {
						resolveUrl: jest.fn().mockResolvedValue(''),
						resolveUrls: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(mockAuthUsers.admin))
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

	describe('GET /admin/shops', () => {
		it('should return active and deactivated shops for admin', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ListShopsForAdminUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce([
				{
					id: orphanShopId,
					sellerId: undefined,
					name: 'Orphan',
					status: ShopStatus.ACTIVE,
					categories: [ShopCategory.UNKNOWN],
				},
				{
					id: shopId,
					sellerId: sellerProfileId,
					name: 'Paused',
					status: ShopStatus.DEACTIVATED,
					categories: [ShopCategory.UNKNOWN],
				},
			]);

			const res = await request(app.getHttpServer())
				.get('/admin/shops')
				.expect(HttpStatus.OK);

			expect(res.body).toHaveLength(2);
			expect(res.body[1].status).toBe(ShopStatus.DEACTIVATED);
			await app.close();
		});
	});

	describe('GET /admin/seller-applications', () => {
		it('should return pending applications', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ListPendingSellerApplicationsUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce([
				{
					seller: {
						id: sellerProfileId,
						userId: createSellerBody.userId,
						name: createSellerBody.name,
						typePerson: createSellerBody.typePerson,
						numberDocument: createSellerBody.numberDocument,
						address: createSellerBody.address,
						phoneNumber: createSellerBody.phoneNumber,
						ruc: '',
						status: SellerStatus.PENDING,
					},
					shops: [
						{
							id: shopId,
							sellerId: sellerProfileId,
							name: createShopBody.name,
							status: ShopStatus.PENDING,
							categories: createShopBody.categories,
						},
					],
				},
			]);

			const res = await request(app.getHttpServer())
				.get('/admin/seller-applications')
				.expect(HttpStatus.OK);

			expect(res.body).toHaveLength(1);
			expect(res.body[0].seller.status).toBe(SellerStatus.PENDING);
			await app.close();
		});
	});

	describe('POST /shops (admin)', () => {
		it('should create ACTIVE shop without sellerId', async () => {
			const app = await buildShopApp();
			const uc = app.get(CreateShopUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: orphanShopId,
				sellerId: undefined,
				name: createShopBody.name,
				status: ShopStatus.ACTIVE,
				categories: createShopBody.categories,
			});

			const res = await request(app.getHttpServer())
				.post('/shops')
				.send(createShopBody)
				.expect(HttpStatus.CREATED);

			expect(res.body.status).toBe(ShopStatus.ACTIVE);
			expect(res.body.sellerId).toBeUndefined();
			expect(uc.handle).toHaveBeenCalledWith(
				createShopBody,
				expect.objectContaining({
					initialStatus: ShopStatus.ACTIVE,
					roles: mockAuthUsers.admin.roles,
				}),
			);
			await app.close();
		});
	});

	describe('GET /admin/shops/available', () => {
		it('should return unlinked shops', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ListAvailableShopsUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce([
				{
					id: orphanShopId,
					sellerId: undefined,
					name: createShopBody.name,
					status: ShopStatus.ACTIVE,
					categories: createShopBody.categories,
				},
			]);

			const res = await request(app.getHttpServer())
				.get('/admin/shops/available')
				.query({ search: 'Tienda' })
				.expect(HttpStatus.OK);

			expect(res.body).toHaveLength(1);
			expect(uc.handle).toHaveBeenCalledWith('Tienda');
			await app.close();
		});
	});

	describe('GET /admin/sellers/available', () => {
		it('should return unassigned sellers', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ListAvailableSellersUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce([
				{
					id: sellerProfileId,
					userId,
					name: createSellerBody.name,
					typePerson: createSellerBody.typePerson,
					numberDocument: createSellerBody.numberDocument,
					address: createSellerBody.address,
					phoneNumber: createSellerBody.phoneNumber,
					ruc: '',
					status: SellerStatus.APPROVED,
				},
			]);

			const res = await request(app.getHttpServer())
				.get('/admin/sellers/available')
				.query({ search: 'Vendedor' })
				.expect(HttpStatus.OK);

			expect(res.body).toHaveLength(1);
			expect(uc.handle).toHaveBeenCalledWith('Vendedor');
			await app.close();
		});
	});

	describe('GET /admin/accounts/by-email', () => {
		it('should return account lookup', async () => {
			const app = await buildAdminApp();
			const uc = app.get(LookupAccountByEmailUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: userId,
				name: 'María García',
				email: sellerEmail,
				status: AccountStatus.ENABLED,
				roles: [AccountRole.USER],
				hasSellerProfile: false,
			});

			const res = await request(app.getHttpServer())
				.get('/admin/accounts/by-email')
				.query({ email: sellerEmail })
				.expect(HttpStatus.OK);

			expect(res.body.email).toBe(sellerEmail);
			expect(res.body.hasSellerProfile).toBe(false);
			expect(uc.handle).toHaveBeenCalledWith(sellerEmail);
			await app.close();
		});

		it('should return 404 when account not found', async () => {
			const app = await buildAdminApp();
			const uc = app.get(LookupAccountByEmailUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(new NotFoundException('Usuario no encontrado'));

			await request(app.getHttpServer())
				.get('/admin/accounts/by-email')
				.query({ email: 'noexiste@example.com' })
				.expect(HttpStatus.NOT_FOUND);

			await app.close();
		});
	});

	describe('POST /admin/sellers/by-email', () => {
		it('should create APPROVED seller from existing account email', async () => {
			const app = await buildAdminApp();
			const uc = app.get(CreateAdminSellerByEmailUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: sellerProfileId,
				userId,
				name: createSellerByEmailBody.name,
				typePerson: createSellerByEmailBody.typePerson,
				numberDocument: createSellerByEmailBody.numberDocument,
				address: createSellerByEmailBody.address,
				phoneNumber: createSellerByEmailBody.phoneNumber,
				ruc: '',
				status: SellerStatus.APPROVED,
			});

			const res = await request(app.getHttpServer())
				.post('/admin/sellers/by-email')
				.send(createSellerByEmailBody)
				.expect(HttpStatus.CREATED);

			expect(res.body.status).toBe(SellerStatus.APPROVED);
			expect(uc.handle).toHaveBeenCalledWith(createSellerByEmailBody);
			await app.close();
		});
	});

	describe('POST /admin/sellers/with-account', () => {
		it('should create account and APPROVED seller', async () => {
			const app = await buildAdminApp();
			const uc = app.get(CreateAdminSellerWithAccountUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: sellerProfileId,
				userId,
				name: createSellerWithAccountBody.name,
				typePerson: createSellerWithAccountBody.typePerson,
				numberDocument: createSellerWithAccountBody.numberDocument,
				address: createSellerWithAccountBody.address,
				phoneNumber: createSellerWithAccountBody.phoneNumber,
				ruc: '',
				status: SellerStatus.APPROVED,
			});

			const res = await request(app.getHttpServer())
				.post('/admin/sellers/with-account')
				.send(createSellerWithAccountBody)
				.expect(HttpStatus.CREATED);

			expect(res.body.status).toBe(SellerStatus.APPROVED);
			expect(uc.handle).toHaveBeenCalledWith(createSellerWithAccountBody);
			await app.close();
		});

		it('should return 409 when email already exists', async () => {
			const app = await buildAdminApp();
			const uc = app.get(CreateAdminSellerWithAccountUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(new ConflictException('Email already in use'));

			await request(app.getHttpServer())
				.post('/admin/sellers/with-account')
				.send(createSellerWithAccountBody)
				.expect(HttpStatus.CONFLICT);

			await app.close();
		});
	});

	describe('POST /admin/sellers', () => {
		it('should create APPROVED seller', async () => {
			const app = await buildAdminApp();
			const uc = app.get(CreateAdminSellerUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: sellerProfileId,
				userId: createSellerBody.userId,
				name: createSellerBody.name,
				typePerson: createSellerBody.typePerson,
				numberDocument: createSellerBody.numberDocument,
				address: createSellerBody.address,
				phoneNumber: createSellerBody.phoneNumber,
				ruc: '',
				status: SellerStatus.APPROVED,
			});

			const res = await request(app.getHttpServer())
				.post('/admin/sellers')
				.send(createSellerBody)
				.expect(HttpStatus.CREATED);

			expect(res.body.status).toBe(SellerStatus.APPROVED);
			expect(uc.handle).toHaveBeenCalledWith(createSellerBody);
			await app.close();
		});
	});

	describe('PATCH /admin/shops/:shopId/unlink-seller', () => {
		it('should unlink seller from shop', async () => {
			const app = await buildAdminApp();
			const uc = app.get(UnlinkShopFromSellerUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: shopId,
				sellerId: undefined,
				name: createShopBody.name,
				status: ShopStatus.ACTIVE,
				categories: createShopBody.categories,
			});

			const res = await request(app.getHttpServer())
				.patch(`/admin/shops/${shopId}/unlink-seller`)
				.expect(HttpStatus.OK);

			expect(res.body.sellerId).toBeUndefined();
			expect(uc.handle).toHaveBeenCalledWith(shopId);
			await app.close();
		});
	});

	describe('PATCH /admin/shops/:shopId/link-seller', () => {
		it('should link orphan shop to seller without shop', async () => {
			const app = await buildAdminApp();
			const uc = app.get(LinkShopToSellerUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				shop: {
					id: orphanShopId,
					sellerId: sellerProfileId,
					name: createShopBody.name,
					status: ShopStatus.ACTIVE,
					categories: createShopBody.categories,
				},
				seller: {
					id: sellerProfileId,
					userId: createSellerBody.userId,
					name: createSellerBody.name,
					typePerson: createSellerBody.typePerson,
					numberDocument: createSellerBody.numberDocument,
					address: createSellerBody.address,
					phoneNumber: createSellerBody.phoneNumber,
					ruc: '',
					status: SellerStatus.APPROVED,
				},
			});

			const res = await request(app.getHttpServer())
				.patch(`/admin/shops/${orphanShopId}/link-seller`)
				.send({ sellerId: sellerProfileId })
				.expect(HttpStatus.OK);

			expect(res.body.shop.status).toBe(ShopStatus.ACTIVE);
			expect(res.body.shop.sellerId).toBe(sellerProfileId);
			expect(uc.handle).toHaveBeenCalledWith(
				orphanShopId,
				sellerProfileId,
			);
			await app.close();
		});

		it('should return 409 when linking shop that already has seller', async () => {
			const app = await buildAdminApp();
			const uc = app.get(LinkShopToSellerUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ConflictException(
						'La tienda ya está enlazada a un vendedor',
					),
				);

			await request(app.getHttpServer())
				.patch(`/admin/shops/${shopId}/link-seller`)
				.send({ sellerId: sellerProfileId })
				.expect(HttpStatus.CONFLICT);

			await app.close();
		});

		it('should return 409 when seller already has a shop', async () => {
			const app = await buildAdminApp();
			const uc = app.get(LinkShopToSellerUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ConflictException(
						'El vendedor ya tiene una tienda asociada',
					),
				);

			await request(app.getHttpServer())
				.patch(`/admin/shops/${orphanShopId}/link-seller`)
				.send({ sellerId: sellerProfileId })
				.expect(HttpStatus.CONFLICT);

			await app.close();
		});
	});

	describe('POST /shops with sellerId conflict', () => {
		it('should return 409 when seller already has shop', async () => {
			const app = await buildShopApp();
			const uc = app.get(CreateShopUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ConflictException(
						'El vendedor ya tiene una tienda asociada',
					),
				);

			await request(app.getHttpServer())
				.post('/shops')
				.send({ ...createShopBody, sellerId: sellerProfileId })
				.expect(HttpStatus.CONFLICT);

			await app.close();
		});
	});

	describe('FORMA 1 smoke — seller-application', () => {
		it('should still create PENDING seller and shop', async () => {
			const app = await buildShopApp({
				...mockAuthUsers.customer,
				userId,
			});
			const uc = app.get(CreateSellerApplicationUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				seller: {
					id: sellerProfileId,
					userId: createSellerBody.userId,
					name: createSellerBody.name,
					typePerson: createSellerBody.typePerson,
					numberDocument: createSellerBody.numberDocument,
					address: createSellerBody.address,
					phoneNumber: createSellerBody.phoneNumber,
					ruc: '',
					status: SellerStatus.PENDING,
				},
				shop: {
					id: shopId,
					sellerId: sellerProfileId,
					name: createShopBody.name,
					status: ShopStatus.PENDING,
					categories: createShopBody.categories,
				},
			});

			const res = await request(app.getHttpServer())
				.post('/shops/seller-application')
				.send({
					seller: {
						typePerson: createSellerBody.typePerson,
						numberDocument: createSellerBody.numberDocument,
						name: createSellerBody.name,
						address: createSellerBody.address,
						phoneNumber: createSellerBody.phoneNumber,
					},
					name: createShopBody.name,
					categories: createShopBody.categories,
				})
				.expect(HttpStatus.CREATED);

			expect(res.body.seller.status).toBe(SellerStatus.PENDING);
			expect(res.body.shop.status).toBe(ShopStatus.PENDING);
			await app.close();
		});
	});
});

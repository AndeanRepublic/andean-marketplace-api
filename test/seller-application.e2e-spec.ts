import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { ShopController } from '../src/andean/infra/controllers/shop/shop.controller';
import { AdminController } from '../src/andean/infra/controllers/admin.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
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
import { ReviewSellerApplicationUseCase } from '../src/andean/app/use_cases/users/ReviewSellerApplicationUseCase';
import { UpdateAccountStatusUseCase } from '../src/andean/app/use_cases/users/UpdateAccountStatusUseCase';
import { GetAllCustomerUseCase } from '../src/andean/app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from '../src/andean/app/use_cases/users/GetAllSellersUseCase';
import { SellerStatus } from '../src/andean/domain/enums/SellerStatus';
import { ShopStatus } from '../src/andean/domain/enums/ShopStatus';
import { PersonType } from '../src/andean/domain/enums/PersonType';
import { ShopCategory } from '../src/andean/domain/enums/ShopCategory';
import { SellerApplicationDecision } from '../src/andean/domain/enums/SellerApplicationDecision';
import { CreateAdminSellerUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerUseCase';
import { LinkShopToSellerUseCase } from '../src/andean/app/use_cases/shop/LinkShopToSellerUseCase';
import { ListShopsForAdminUseCase } from '../src/andean/app/use_cases/shop/ListShopsForAdminUseCase';
import { ListPendingSellerApplicationsUseCase } from '../src/andean/app/use_cases/users/ListPendingSellerApplicationsUseCase';
import { GetSellerApplicationDetailUseCase } from '../src/andean/app/use_cases/users/GetSellerApplicationDetailUseCase';
import { UnlinkShopFromSellerUseCase } from '../src/andean/app/use_cases/shop/UnlinkShopFromSellerUseCase';
import { ListAvailableSellersUseCase } from '../src/andean/app/use_cases/shop/ListAvailableSellersUseCase';
import { ListAvailableShopsUseCase } from '../src/andean/app/use_cases/shop/ListAvailableShopsUseCase';
import { LookupAccountByEmailUseCase } from '../src/andean/app/use_cases/users/LookupAccountByEmailUseCase';
import { CreateAdminSellerByEmailUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerByEmailUseCase';
import { CreateAdminSellerWithAccountUseCase } from '../src/andean/app/use_cases/users/CreateAdminSellerWithAccountUseCase';

const userId = '507f1f77bcf86cd799439011';
const sellerProfileId = '507f1f77bcf86cd799439012';
const shopId = '507f1f77bcf86cd799439013';

describe('Seller application flow (e2e)', () => {
	const applicationBody = {
		seller: {
			typePerson: PersonType.NATURAL,
			numberDocument: '12345678',
			name: 'María García',
			address: 'Cusco',
			phoneNumber: '+51987654321',
		},
		name: 'Tienda Andina',
		categories: [ShopCategory.UNKNOWN],
	};

	async function buildShopApp(
		authUser: { userId: string; roles: unknown[] } | null,
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
			.useValue(
				authUser ? createAllowAllGuard(authUser as any) : createDenyAllGuard(),
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
					provide: LinkShopToSellerUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ListShopsForAdminUseCase,
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
					provide: UnlinkShopFromSellerUseCase,
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

	describe('POST /shops/seller-application', () => {
		it('should return 201 when authenticated user submits application', async () => {
			const app = await buildShopApp({ ...mockAuthUsers.customer, userId });
			const uc = app.get(CreateSellerApplicationUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				seller: {
					id: sellerProfileId,
					userId,
					...applicationBody.seller,
					ruc: '',
					status: SellerStatus.PENDING,
				},
				shop: {
					id: shopId,
					sellerId: sellerProfileId,
					name: applicationBody.name,
					status: ShopStatus.PENDING,
					categories: applicationBody.categories,
				},
			});

			await request(app.getHttpServer())
				.post('/shops/seller-application')
				.send(applicationBody)
				.expect(HttpStatus.CREATED);

			expect(uc.handle).toHaveBeenCalledWith(userId, applicationBody);
			await app.close();
		});

		it('should return 401 without token', async () => {
			const app = await buildShopApp(null);
			await request(app.getHttpServer())
				.post('/shops/seller-application')
				.send(applicationBody)
				.expect(HttpStatus.UNAUTHORIZED);
			await app.close();
		});
	});

	describe('GET /admin/seller-applications/:userId', () => {
		it('should return 200 with application detail for admin', async () => {
			const app = await buildAdminApp();
			const uc = app.get(GetSellerApplicationDetailUseCase);
			const detail = {
				seller: {
					id: sellerProfileId,
					userId,
					...applicationBody.seller,
					ruc: '',
					status: SellerStatus.PENDING,
				},
				account: { email: 'seller@test.com', name: 'María García' },
				shops: [
					{
						id: shopId,
						sellerId: sellerProfileId,
						name: applicationBody.name,
						status: ShopStatus.PENDING,
						categories: applicationBody.categories,
						seals: [],
					},
				],
			};
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(detail);

			const res = await request(app.getHttpServer())
				.get(`/admin/seller-applications/${userId}`)
				.expect(HttpStatus.OK);

			expect(res.body.account.email).toBe('seller@test.com');
			expect(uc.handle).toHaveBeenCalledWith(userId);
			await app.close();
		});
	});

	describe('PATCH /admin/seller-applications/:userId/review', () => {
		it('should return 200 when admin approves application', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ReviewSellerApplicationUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				seller: {
					id: sellerProfileId,
					userId,
					...applicationBody.seller,
					ruc: '',
					status: SellerStatus.APPROVED,
				},
				shops: [
					{
						id: shopId,
						sellerId: sellerProfileId,
						name: applicationBody.name,
						status: ShopStatus.ACTIVE,
						categories: applicationBody.categories,
					},
				],
			});

			await request(app.getHttpServer())
				.patch(`/admin/seller-applications/${userId}/review`)
				.send({ decision: SellerApplicationDecision.APPROVED })
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				userId,
				SellerApplicationDecision.APPROVED,
				undefined,
			);
			await app.close();
		});

		it('should return 400 when admin rejects without rejectionReason', async () => {
			const app = await buildAdminApp();

			await request(app.getHttpServer())
				.patch(`/admin/seller-applications/${userId}/review`)
				.send({ decision: SellerApplicationDecision.REJECTED })
				.expect(HttpStatus.BAD_REQUEST);

			await app.close();
		});

		it('should return 200 when admin rejects application with reason', async () => {
			const app = await buildAdminApp();
			const uc = app.get(ReviewSellerApplicationUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				seller: {
					id: sellerProfileId,
					userId,
					...applicationBody.seller,
					ruc: '',
					status: SellerStatus.REJECTED,
				},
				shops: [
					{
						id: shopId,
						sellerId: sellerProfileId,
						name: applicationBody.name,
						status: ShopStatus.REJECTED,
						categories: applicationBody.categories,
					},
				],
			});

			const rejectionReason = 'Documentación incompleta o inválida.';

			await request(app.getHttpServer())
				.patch(`/admin/seller-applications/${userId}/review`)
				.send({
					decision: SellerApplicationDecision.REJECTED,
					rejectionReason,
				})
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				userId,
				SellerApplicationDecision.REJECTED,
				rejectionReason,
			);

			await app.close();
		});
	});

	describe('PATCH /shops/:shopId/visibility', () => {
		it('should return 200 when seller toggles visibility', async () => {
			const app = await buildShopApp(mockAuthUsers.seller);
			const uc = app.get(UpdateShopVisibilityUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce({
				id: shopId,
				sellerId: sellerProfileId,
				name: 'Tienda',
				status: ShopStatus.DEACTIVATED,
				categories: [ShopCategory.UNKNOWN],
			});

			await request(app.getHttpServer())
				.patch(`/shops/${shopId}/visibility`)
				.send({ status: ShopStatus.DEACTIVATED })
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				shopId,
				ShopStatus.DEACTIVATED,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
			await app.close();
		});
	});
});

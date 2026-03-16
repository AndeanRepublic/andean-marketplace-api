import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { ShopController } from '../src/andean/infra/controllers/shop.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { GetShopByIdUseCase } from '../src/andean/app/use_cases/shops/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from '../src/andean/app/use_cases/shops/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from '../src/andean/app/use_cases/shops/GetShopsBySellerIdUseCase';
import { CreateShopUseCase } from '../src/andean/app/use_cases/shops/CreateShopUseCase';
import { DeleteShopUseCase } from '../src/andean/app/use_cases/shops/DeleteShopUseCase';

describe('ShopController (e2e) — ownership', () => {
	const mockShopId = 'shop-uuid-001';

	const mockShop = {
		id: mockShopId,
		sellerId: 'seller-profile-uuid-001',
		name: 'Tienda Andina',
		description: 'Tienda de productos andinos',
		categories: ['UNKNOWN'],
		policies: 'Política de devoluciones: 30 días',
		shippingOrigin: 'Cusco, Perú',
		shippingArea: 'Nacional',
	};

	// ─── Helper to build app with a given auth user ──────────────────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
	): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ShopController],
			providers: [
				{
					provide: GetShopByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockShop) },
				},
				{
					provide: GetShopsByCategoryUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockShop]) },
				},
				{
					provide: GetShopsBySellerIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockShop]) },
				},
				{
					provide: CreateShopUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockShop) },
				},
				{
					provide: DeleteShopUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(authUser ? createAllowAllGuard(authUser) : createDenyAllGuard())
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

	// ─── DELETE /shops/:shopId ────────────────────────────────────────
	describe('DELETE /shops/:shopId', () => {
		it('should return 204 when SELLER owner deletes their shop', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const uc = app.get(DeleteShopUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/shops/${mockShopId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(uc.handle).toHaveBeenCalledWith(
				mockShopId,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);

			await app.close();
		});

		it('should return 403 when SELLER non-owner tries to delete', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const uc = app.get(DeleteShopUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ForbiddenException('You can only modify your own resource'),
				);

			await request(app.getHttpServer())
				.delete(`/shops/${mockShopId}`)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 403 when SELLER has no SellerProfile', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const uc = app.get(DeleteShopUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ForbiddenException('You can only modify your own resource'),
				);

			await request(app.getHttpServer())
				.delete(`/shops/${mockShopId}`)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 204 when ADMIN deletes any shop', async () => {
			const app = await buildApp(mockAuthUsers.admin);
			const uc = app.get(DeleteShopUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/shops/${mockShopId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(uc.handle).toHaveBeenCalledWith(
				mockShopId,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
			);

			await app.close();
		});

		it('should return 404 when shop does not exist', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const uc = app.get(DeleteShopUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(new NotFoundException('Shop not found'));

			await request(app.getHttpServer())
				.delete('/shops/non-existent-shop-id')
				.expect(HttpStatus.NOT_FOUND);

			await app.close();
		});

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.delete(`/shops/${mockShopId}`)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});
});

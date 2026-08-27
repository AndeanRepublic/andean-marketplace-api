import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { SellerController } from '../src/andean/infra/controllers/seller.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { GetSellerWorkspaceUseCase } from '../src/andean/app/use_cases/sellers/GetSellerWorkspaceUseCase';
import { SellerCatalog } from '../src/andean/domain/enums/SellerCatalog';
import { ShopCategory } from '../src/andean/domain/enums/ShopCategory';

describe('SellerController (e2e)', () => {
	const workspace = {
		sellerId: 'seller-profile-1',
		catalogs: [SellerCatalog.TEXTILES, SellerCatalog.EXPERIENCES],
		shopIds: ['shop-1'],
		communityIds: ['community-1'],
		shops: [
			{
				id: 'shop-1',
				name: 'Andean Textiles',
				categories: [ShopCategory.TEXTILES],
			},
		],
	};

	async function buildApp(authUser: { userId: string; roles: unknown[] } | null) {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SellerController],
			providers: [
				{
					provide: GetSellerWorkspaceUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(workspace) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(
				authUser ? createAllowAllGuard(authUser as never) : createDenyAllGuard(),
			)
			.overrideGuard(RolesGuard)
			.useValue({
				canActivate: () =>
					Boolean(
						authUser?.roles?.includes('SELLER') ||
							authUser?.roles?.some((r) => String(r) === 'SELLER'),
					),
			})
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
		return { app, module };
	}

	it('returns workspace for SELLER', async () => {
		const { app, module } = await buildApp(mockAuthUsers.seller);
		const uc = module.get(GetSellerWorkspaceUseCase);

		await request(app.getHttpServer())
			.get('/sellers/me/workspace')
			.expect(HttpStatus.OK)
			.expect((res) => {
				expect(res.body).toMatchObject({
					sellerId: workspace.sellerId,
					catalogs: workspace.catalogs,
					shopIds: workspace.shopIds,
				});
			});

		expect(uc.handle).toHaveBeenCalledWith(mockAuthUsers.seller.userId);
		await app.close();
	});

	it('returns 403 for USER', async () => {
		const { app } = await buildApp(mockAuthUsers.customer);
		await request(app.getHttpServer())
			.get('/sellers/me/workspace')
			.expect(HttpStatus.FORBIDDEN);
		await app.close();
	});

	it('returns 401 when unauthenticated', async () => {
		const { app } = await buildApp(null);
		await request(app.getHttpServer())
			.get('/sellers/me/workspace')
			.expect(HttpStatus.UNAUTHORIZED);
		await app.close();
	});
});

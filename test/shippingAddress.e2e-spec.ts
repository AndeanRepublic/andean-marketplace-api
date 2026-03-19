import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
} from '@nestjs/common';
import request from 'supertest';
import { ShippingAddressController } from '../src/andean/infra/controllers/shippingAddress.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateShippingAddressUseCase } from '../src/andean/app/use_cases/shipping/CreateShippingAddressUseCase';
import { GetShippingAddressesByCustomerUseCase } from '../src/andean/app/use_cases/shipping/GetShippingAddressesByCustomerUseCase';
import { UpdateShippingAddressUseCase } from '../src/andean/app/use_cases/shipping/UpdateShippingAddressUseCase';
import { DeleteShippingAddressUseCase } from '../src/andean/app/use_cases/shipping/DeleteShippingAddressUseCase';
import { SetDefaultShippingAddressUseCase } from '../src/andean/app/use_cases/shipping/SetDefaultShippingAddressUseCase';
import { GetShippingAddressByIdUseCase } from '../src/andean/app/use_cases/shipping/GetShippingAddressByIdUseCase';
import { FixtureLoader } from './helpers/fixture-loader';

describe('ShippingAddressController (e2e) — ownership', () => {
	const fixture = FixtureLoader.loadShippingAddress();
	const mockAddress = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as any;
	const updateDto = fixture.updateDto;

	// ─── Helper to build app with a given auth user ──────────────────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
	): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ShippingAddressController],
			providers: [
				{
					provide: CreateShippingAddressUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockAddress) },
				},
				{
					provide: GetShippingAddressesByCustomerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockAddress]) },
				},
				{
					provide: UpdateShippingAddressUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockAddress) },
				},
				{
					provide: DeleteShippingAddressUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: SetDefaultShippingAddressUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockAddress) },
				},
				{
					provide: GetShippingAddressByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockAddress) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(authUser ? createAllowAllGuard(authUser) : createDenyAllGuard())
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

	// ─── PUT /shipping-addresses/:id ─────────────────────────────────
	describe('PUT /shipping-addresses/:id', () => {
		it('should return 200 when owner updates their own address', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const updateUseCase = app.get(UpdateShippingAddressUseCase);
			jest.spyOn(updateUseCase, 'handle').mockResolvedValueOnce(mockAddress);

			await request(app.getHttpServer())
				.put(`/shipping-addresses/${mockAddress.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(updateUseCase.handle).toHaveBeenCalledWith(
				mockAddress.id,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
				updateDto,
			);

			await app.close();
		});

		it('should return 403 when non-owner tries to update', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const updateUseCase = app.get(UpdateShippingAddressUseCase);
			jest
				.spyOn(updateUseCase, 'handle')
				.mockRejectedValueOnce(new ForbiddenException('forbidden'));

			await request(app.getHttpServer())
				.put(`/shipping-addresses/${mockAddress.id}`)
				.send(updateDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 200 when ADMIN updates any address', async () => {
			const app = await buildApp(mockAuthUsers.admin);
			const updateUseCase = app.get(UpdateShippingAddressUseCase);
			jest.spyOn(updateUseCase, 'handle').mockResolvedValueOnce(mockAddress);

			await request(app.getHttpServer())
				.put(`/shipping-addresses/${mockAddress.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(updateUseCase.handle).toHaveBeenCalledWith(
				mockAddress.id,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
				updateDto,
			);

			await app.close();
		});

		it('should return 401 when no JWT token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.put(`/shipping-addresses/${mockAddress.id}`)
				.send(updateDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});

	// ─── DELETE /shipping-addresses/:id ──────────────────────────────
	describe('DELETE /shipping-addresses/:id', () => {
		it('should return 204 when owner deletes their own address', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const deleteUseCase = app.get(DeleteShippingAddressUseCase);
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/shipping-addresses/${mockAddress.id}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(deleteUseCase.handle).toHaveBeenCalledWith(
				mockAddress.id,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
			);

			await app.close();
		});

		it('should return 403 when non-owner non-admin tries to delete', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const deleteUseCase = app.get(DeleteShippingAddressUseCase);
			jest
				.spyOn(deleteUseCase, 'handle')
				.mockRejectedValueOnce(new ForbiddenException('forbidden'));

			await request(app.getHttpServer())
				.delete(`/shipping-addresses/${mockAddress.id}`)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 204 when ADMIN deletes any address', async () => {
			const app = await buildApp(mockAuthUsers.admin);
			const deleteUseCase = app.get(DeleteShippingAddressUseCase);
			jest.spyOn(deleteUseCase, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/shipping-addresses/${mockAddress.id}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(deleteUseCase.handle).toHaveBeenCalledWith(
				mockAddress.id,
				mockAuthUsers.admin.userId,
				mockAuthUsers.admin.roles,
			);

			await app.close();
		});

		it('should return 401 when no JWT token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.delete(`/shipping-addresses/${mockAddress.id}`)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});
});

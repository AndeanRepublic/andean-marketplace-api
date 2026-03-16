import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
} from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../src/andean/infra/controllers/user.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { UpdateCustomerProfileUseCase } from '../src/andean/app/use_cases/users/UpdateCustomerProfileUseCase';
import { UpdateSellerProfileUseCase } from '../src/andean/app/use_cases/users/UpdateSellerProfileUseCase';
import { GetAllCustomerUseCase } from '../src/andean/app/use_cases/users/GetAllCustomerUseCase';
import { CreateCustomerUseCase } from '../src/andean/app/use_cases/users/CreateCustomerUseCase';
import { GetAllSellersUseCase } from '../src/andean/app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from '../src/andean/app/use_cases/users/CreateSellerUseCase';
import { GetCustomerProfileUseCase } from '../src/andean/app/use_cases/users/GetCustomerProfileUseCase';
import { GetSellerProfileUseCase } from '../src/andean/app/use_cases/users/GetSellerProfileUseCase';
import { PersonType } from '../src/andean/domain/enums/PersonType';

describe('UserController (e2e) — ownership', () => {
	const mockCustomerProfileDto = {
		phoneNumber: '+51987654321',
		country: 'Peru',
		language: 'es',
	};

	const mockSellerProfileDto = {
		name: 'María Quispe',
		phoneNumber: '+51987654321',
		numberDocument: '12345678',
		ruc: '20123456789',
		typePerson: PersonType.NATURAL,
		country: 'Peru',
		address: 'Av. El Sol 123, Cusco',
	};

	// ─── Helper to build app with a given auth user ─────────────────────────────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
	): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: GetAllCustomerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([]) },
				},
				{
					provide: CreateCustomerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue({}) },
				},
				{
					provide: GetAllSellersUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([]) },
				},
				{
					provide: CreateSellerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue({}) },
				},
				{
					provide: GetCustomerProfileUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(null) },
				},
				{
					provide: GetSellerProfileUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(null) },
				},
				{
					provide: UpdateCustomerProfileUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: UpdateSellerProfileUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) },
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

	// ─── PUT /users/customers/:userId/profile ───────────────────────────────────
	describe('PUT /users/customers/:userId/profile', () => {
		it('should return 200 when owner updates their own customer profile', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const uc = app.get(UpdateCustomerProfileUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.put(`/users/customers/${mockAuthUsers.customer.userId}/profile`)
				.send(mockCustomerProfileDto)
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.userId,
				mockAuthUsers.customer.roles,
				expect.objectContaining(mockCustomerProfileDto),
			);

			await app.close();
		});

		it('should return 403 when non-owner tries to update another customer profile', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const uc = app.get(UpdateCustomerProfileUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ForbiddenException('You can only modify your own profile'),
				);

			await request(app.getHttpServer())
				.put('/users/customers/other-user-id/profile')
				.send(mockCustomerProfileDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 200 when ADMIN updates any customer profile', async () => {
			const app = await buildApp(mockAuthUsers.admin);
			const uc = app.get(UpdateCustomerProfileUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.put('/users/customers/any-user-id/profile')
				.send(mockCustomerProfileDto)
				.expect(HttpStatus.OK);

			await app.close();
		});

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.put(`/users/customers/some-user-id/profile`)
				.send(mockCustomerProfileDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});

	// ─── PUT /users/sellers/:userId/profile ─────────────────────────────────────
	describe('PUT /users/sellers/:userId/profile', () => {
		it('should return 200 when owner updates their own seller profile', async () => {
			const app = await buildApp(mockAuthUsers.seller);
			const uc = app.get(UpdateSellerProfileUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.put(`/users/sellers/${mockAuthUsers.seller.userId}/profile`)
				.send(mockSellerProfileDto)
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
				expect.objectContaining({ name: mockSellerProfileDto.name }),
			);

			await app.close();
		});

		it('should return 403 when non-owner tries to update another seller profile', async () => {
			const app = await buildApp(mockAuthUsers.customer);
			const uc = app.get(UpdateSellerProfileUseCase);
			jest
				.spyOn(uc, 'handle')
				.mockRejectedValueOnce(
					new ForbiddenException('You can only update your own profile'),
				);

			await request(app.getHttpServer())
				.put('/users/sellers/other-seller-id/profile')
				.send(mockSellerProfileDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 200 when ADMIN updates any seller profile', async () => {
			const app = await buildApp(mockAuthUsers.admin);
			const uc = app.get(UpdateSellerProfileUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.put('/users/sellers/any-seller-id/profile')
				.send(mockSellerProfileDto)
				.expect(HttpStatus.OK);

			await app.close();
		});

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.put('/users/sellers/some-seller-id/profile')
				.send(mockSellerProfileDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});
});

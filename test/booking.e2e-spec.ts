import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BookingController } from '../src/andean/infra/controllers/booking.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateBookingUseCase } from '../src/andean/app/use_cases/bookings/CreateBookingUseCase';
import { CreatePayPalBookingOrderUseCase } from '../src/andean/app/use_cases/bookings/CreatePayPalBookingOrderUseCase';
import { CapturePayPalBookingUseCase } from '../src/andean/app/use_cases/bookings/CapturePayPalBookingUseCase';
import { GetBookingByIdUseCase } from '../src/andean/app/use_cases/bookings/GetBookingByIdUseCase';
import { GetBookingsByCustomerUseCase } from '../src/andean/app/use_cases/bookings/GetBookingsByCustomerUseCase';
import { GetBookingsByEmailUseCase } from '../src/andean/app/use_cases/bookings/GetBookingsByEmailUseCase';
import { UpdateBookingStatusUseCase } from '../src/andean/app/use_cases/bookings/UpdateBookingStatusUseCase';
import { BookingStatus } from '../src/andean/domain/enums/BookingStatus';

describe('BookingController (e2e) — Pattern C authorization', () => {
	// Valid MongoDB ObjectId for use case happy path
	const bookingId = '507f1f77bcf86cd799439011';

	const mockUpdateStatusDto = {
		status: BookingStatus.CONFIRMED,
	};

	const mockBooking = {
		id: bookingId,
		status: BookingStatus.CONFIRMED,
	};

	// ─── Helper to build app with a given auth user and role guard control ───────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
		allowRoles = true,
	): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookingController],
			providers: [
				{
					provide: CreateBookingUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBooking) },
				},
				{
					provide: CreatePayPalBookingOrderUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({ orderId: 'paypal-order-id' }),
					},
				},
				{
					provide: CapturePayPalBookingUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							success: true,
							orderId: 'paypal-order-id',
							status: 'COMPLETED',
							transactionId: 'txn-001',
							booking: mockBooking,
						}),
					},
				},
				{
					provide: GetBookingByIdUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBooking) },
				},
				{
					provide: GetBookingsByCustomerUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockBooking]) },
				},
				{
					provide: GetBookingsByEmailUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockBooking]) },
				},
				{
					provide: UpdateBookingStatusUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockBooking) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(authUser ? createAllowAllGuard(authUser) : createDenyAllGuard())
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => allowRoles })
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

	// ─── PUT /bookings/:id/status ─────────────────────────────────────────────────
	describe('PUT /bookings/:id/status', () => {
		it('should return 200 when ADMIN updates booking status', async () => {
			const app = await buildApp(mockAuthUsers.admin, true);
			const uc = app.get(UpdateBookingStatusUseCase);
			jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockBooking as any);

			await request(app.getHttpServer())
				.put(`/bookings/${bookingId}/status`)
				.send(mockUpdateStatusDto)
				.expect(HttpStatus.OK);

			expect(uc.handle).toHaveBeenCalledWith(
				bookingId,
				expect.objectContaining({ status: BookingStatus.CONFIRMED }),
			);

			await app.close();
		});

		it('should return 403 when SELLER attempts to update booking status', async () => {
			const app = await buildApp(mockAuthUsers.seller, false);

			await request(app.getHttpServer())
				.put(`/bookings/${bookingId}/status`)
				.send(mockUpdateStatusDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 403 when USER attempts to update booking status', async () => {
			const app = await buildApp(mockAuthUsers.customer, false);

			await request(app.getHttpServer())
				.put(`/bookings/${bookingId}/status`)
				.send(mockUpdateStatusDto)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null, true);

			await request(app.getHttpServer())
				.put(`/bookings/${bookingId}/status`)
				.send(mockUpdateStatusDto)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});
});

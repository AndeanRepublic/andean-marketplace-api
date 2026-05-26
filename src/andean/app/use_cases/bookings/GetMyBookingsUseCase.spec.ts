import { Test, TestingModule } from '@nestjs/testing';
import { GetMyBookingsUseCase } from './GetMyBookingsUseCase';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { AgeGroupCode } from '../../../domain/enums/AgeGroupCode';
import { ExperienceLanguage } from '../../../domain/enums/ExperienceLanguage';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';

describe('GetMyBookingsUseCase', () => {
	let useCase: GetMyBookingsUseCase;
	let bookingRepository: jest.Mocked<BookingRepository>;

	const mockBooking: Booking = new Booking(
		'booking-123',
		{
			customerId: 'user-789',
			email: 'user@example.com',
			firstName: 'John',
			lastName: 'Doe',
			phoneNumber: '+51999888777',
		},
		BookingStatus.CONFIRMED,
		new Date('2026-06-01'),
		{
			experienceId: 'exp-456',
			experienceSnapshot: {
				name: 'Machu Picchu Tour',
				days: 4,
				nights: 3,
				ageGroupPricing: [
					{
						code: AgeGroupCode.ADULTS,
						label: 'Adult',
						minAge: 18,
						price: 500,
					},
				],
			},
		},
		{
			subtotal: 1000,
			total: 1000,
			currency: 'USD',
		},
		{
			ageGroups: [{ code: AgeGroupCode.ADULTS, quantity: 2 }],
			totalGuests: 2,
			travelersInfo: [
				{
					firstName: 'John',
					lastName: 'Doe',
					country: 'US',
					birthDate: new Date('1990-01-01'),
				},
			],
			language: ExperienceLanguage.ENGLISH,
		},
		{
			method: PaymentMethod.PAYPAL,
			status: PaymentStatus.PAID,
		},
		new Date('2026-05-20'),
		new Date('2026-05-20'),
	);

	beforeEach(async () => {
		const mockBookingRepository = {
			getBookingsByCustomerId: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetMyBookingsUseCase,
				{
					provide: BookingRepository,
					useValue: mockBookingRepository,
				},
			],
		}).compile();

		useCase = module.get<GetMyBookingsUseCase>(GetMyBookingsUseCase);
		bookingRepository = module.get(BookingRepository);
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('handle', () => {
		it('should call bookingRepository.getBookingsByCustomerId with the correct userId', async () => {
			const userId = 'user-789';
			bookingRepository.getBookingsByCustomerId.mockResolvedValue([
				mockBooking,
			]);

			await useCase.handle(userId);

			expect(bookingRepository.getBookingsByCustomerId).toHaveBeenCalledWith(
				userId,
			);
			expect(bookingRepository.getBookingsByCustomerId).toHaveBeenCalledTimes(
				1,
			);
		});

		it('should return the bookings from the repository', async () => {
			const userId = 'user-789';
			const expectedBookings = [mockBooking];
			bookingRepository.getBookingsByCustomerId.mockResolvedValue(
				expectedBookings,
			);

			const result = await useCase.handle(userId);

			expect(result).toEqual(expectedBookings);
		});

		it('should return an empty array when user has no bookings', async () => {
			const userId = 'user-no-bookings';
			bookingRepository.getBookingsByCustomerId.mockResolvedValue([]);

			const result = await useCase.handle(userId);

			expect(result).toEqual([]);
		});
	});
});

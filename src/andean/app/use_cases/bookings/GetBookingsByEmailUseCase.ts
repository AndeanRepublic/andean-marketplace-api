import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { Booking } from '../../../domain/entities/booking/Booking';

@Injectable()
export class GetBookingsByEmailUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(email: string): Promise<Booking[]> {
		if (!email || !email.trim()) {
			throw new BadRequestException('Email is required');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new BadRequestException('Invalid email format');
		}

		return this.bookingRepository.getBookingsByCustomerEmail(email);
	}
}

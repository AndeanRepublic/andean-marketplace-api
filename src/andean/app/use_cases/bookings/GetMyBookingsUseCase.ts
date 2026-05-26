import { Inject, Injectable } from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { Booking } from '../../../domain/entities/booking/Booking';

@Injectable()
export class GetMyBookingsUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(userId: string): Promise<Booking[]> {
		return this.bookingRepository.getBookingsByCustomerId(userId);
	}
}

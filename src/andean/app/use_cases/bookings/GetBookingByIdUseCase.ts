import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { Booking } from '../../../domain/entities/booking/Booking';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class GetBookingByIdUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(bookingId: string): Promise<Booking> {
		if (!isValidObjectId(bookingId)) {
			throw new BadRequestException('Invalid booking ID');
		}

		const booking = await this.bookingRepository.getBookingById(bookingId);
		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		return booking;
	}
}

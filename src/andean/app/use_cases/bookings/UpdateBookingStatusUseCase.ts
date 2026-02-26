import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { UpdateBookingDto } from '../../../infra/controllers/dto/booking/UpdateBookingDto';
import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UpdateBookingStatusUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(bookingId: string, dto: UpdateBookingDto): Promise<Booking> {
		if (!isValidObjectId(bookingId)) {
			throw new BadRequestException('Invalid booking ID');
		}

		const bookingFound =
			await this.bookingRepository.getBookingById(bookingId);
		if (!bookingFound) {
			throw new NotFoundException('Booking not found');
		}

		const newStatus = BookingStatus[dto.status as keyof typeof BookingStatus];
		if (!newStatus) {
			throw new BadRequestException(`Invalid booking status: ${dto.status}`);
		}

		return this.bookingRepository.changeBookingStatus(bookingId, newStatus);
	}
}

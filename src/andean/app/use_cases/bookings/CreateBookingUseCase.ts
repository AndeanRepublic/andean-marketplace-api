import {
	Inject,
	Injectable,
	BadRequestException,
	ConflictException,
} from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { CreateBookingDto } from '../../../infra/controllers/dto/booking/CreateBookingDto';
import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingMapper } from '../../../infra/services/booking/BookingMapper';

@Injectable()
export class CreateBookingUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(dto: CreateBookingDto): Promise<Booking> {
		if (!dto.customerInfo.customerId && !dto.customerInfo.email) {
			throw new BadRequestException(
				'Either customerId or email must be present in customerInfo',
			);
		}

		const startDate = new Date(dto.experienceDate);
		const days = dto.experience.experienceSnapshot.days;
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + days - 1);

		const overlapping = await this.bookingRepository.getOverlappingBookings(
			dto.experience.experienceId,
			startDate,
			endDate,
		);

		if (overlapping.length > 0) {
			throw new ConflictException(
				'the selected dates are not available. There is already a booking for this experience in that period.',
			);
		}

		const booking = BookingMapper.fromCreateDto(dto);
		return this.bookingRepository.createBooking(booking);
	}
}

import { Inject, Injectable, BadRequestException } from '@nestjs/common';
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

		const booking = BookingMapper.fromCreateDto(dto);
		return this.bookingRepository.createBooking(booking);
	}
}

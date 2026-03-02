import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { Booking } from '../../../domain/entities/booking/Booking';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class GetBookingsByCustomerUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(customerId: string): Promise<Booking[]> {
		if (!isValidObjectId(customerId)) {
			throw new BadRequestException('Invalid customer ID');
		}

		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('Customer not found');
		}

		return this.bookingRepository.getBookingsByCustomerId(customerId);
	}
}

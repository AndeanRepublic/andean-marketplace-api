import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingStatus } from '../../../domain/enums/BookingStatus';

export abstract class BookingRepository {
	abstract getBookingById(id: string): Promise<Booking | null>;
	abstract getBookingsByCustomerId(customerId: string): Promise<Booking[]>;
	abstract getBookingsByCustomerEmail(email: string): Promise<Booking[]>;
	abstract createBooking(booking: Booking): Promise<Booking>;
	abstract updateBooking(
		id: string,
		booking: Partial<Booking>,
	): Promise<Booking>;
	abstract changeBookingStatus(
		id: string,
		status: BookingStatus,
	): Promise<Booking>;
	abstract getOverlappingBookings(
		experienceId: string,
		startDate: Date,
		endDate: Date,
	): Promise<Booking[]>;
	abstract getFutureBookings(experienceId: string): Promise<Date[]>;
}

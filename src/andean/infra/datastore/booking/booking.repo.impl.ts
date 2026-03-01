import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../../app/datastore/booking/Booking.repo';
import { InjectModel } from '@nestjs/mongoose';
import { BookingDocument } from '../../persistence/booking/booking.schema';
import { Booking } from '../../../domain/entities/booking/Booking';
import { Model } from 'mongoose';
import { BookingMapper } from '../../services/booking/BookingMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { BookingStatus } from '../../../domain/enums/BookingStatus';

@Injectable()
export class BookingRepositoryImpl extends BookingRepository {
	constructor(
		@InjectModel('Booking')
		private readonly bookingModel: Model<BookingDocument>,
	) {
		super();
	}

	async getBookingById(id: string): Promise<Booking | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.bookingModel.findById(objectId).exec();
		return doc ? BookingMapper.fromDocument(doc) : null;
	}

	async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
		const docs = await this.bookingModel
			.find({ 'customerInfo.customerId': customerId })
			.exec();
		return docs.map((doc) => BookingMapper.fromDocument(doc));
	}

	async getBookingsByCustomerEmail(email: string): Promise<Booking[]> {
		const docs = await this.bookingModel
			.find({ 'customerInfo.email': email })
			.exec();
		return docs.map((doc) => BookingMapper.fromDocument(doc));
	}

	async createBooking(booking: Booking): Promise<Booking> {
		const plain = BookingMapper.toPersistence(booking);
		const created = new this.bookingModel({
			...plain,
		});
		const saved = await created.save();
		return BookingMapper.fromDocument(saved);
	}

	async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
		const plain = BookingMapper.toPersistence(booking);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.bookingModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return BookingMapper.fromDocument(updated!);
	}

	async changeBookingStatus(
		id: string,
		status: BookingStatus,
	): Promise<Booking> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.bookingModel
			.findByIdAndUpdate(
				objectId,
				{ $set: { status, updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Booking not found');
		}
		return BookingMapper.fromDocument(updated);
	}

	async getOverlappingBookings(
		experienceId: string,
		startDate: Date,
		endDate: Date,
	): Promise<Booking[]> {
		const docs = await this.bookingModel
			.find({
				'experience.experienceId': experienceId,
				status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
			})
			.exec();

		const bookings = docs.map((doc) => BookingMapper.fromDocument(doc));
		const overlapping: Booking[] = [];

		for (const booking of bookings) {
			const existingStart = new Date(booking.experienceDate);
			const days = booking.experience.experienceSnapshot.days;
			const existingEnd = new Date(existingStart);
			existingEnd.setDate(existingEnd.getDate() + days - 1);

			const startA = existingStart.getTime();
			const endA = existingEnd.getTime();
			const startB = startDate.getTime();
			const endB = endDate.getTime();

			if (startA <= endB && endA >= startB) {
				overlapping.push(booking);
			}
		}

		return overlapping;
	}

	async getFutureBookings(experienceId: string): Promise<Date[]> {
		// get future bookings
		const now = new Date();
		const docs = await this.bookingModel
			.find({
				'experience.experienceId': experienceId,
				experienceDate: { $gte: now },
				status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
			})
			.select({ experienceDate: 1, _id: 0 })
			.exec();

		return docs.map((doc: BookingDocument) => doc.experienceDate);
	}

	async getTotalGuestsReservedForDate(
		experienceId: string,
		date: Date,
	): Promise<number> {
		const docs = await this.bookingModel
			.find({
				'experience.experienceId': experienceId,
				experienceDate: date,
				status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
			})
			.select({ guestsInfo: 1, _id: 0 })
			.exec();
		return docs.reduce((acc, doc) => acc + doc.guestsInfo.totalGuests, 0);
	}
}

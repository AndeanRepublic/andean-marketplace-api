import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingDocument } from '../../persistence/booking/booking.schema';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateBookingDto } from '../../controllers/dto/booking/CreateBookingDto';
import { Types } from 'mongoose';

export class BookingMapper {
	static fromDocument(doc: BookingDocument): Booking {
		const plain = doc.toObject();
		return plainToInstance(Booking, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateBookingDto): Booking {
		const now = new Date();
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
			createdAt: now,
			updatedAt: now,
		};
		return plainToInstance(Booking, plain);
	}

	static toPersistence(booking: Booking | Partial<Booking>) {
		const plain = instanceToPlain(booking);
		const { id, _id, __v, ...updateData } = plain;
		return {
			...updateData,
		};
	}
}

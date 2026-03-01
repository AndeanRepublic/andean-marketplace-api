import { Booking } from '../../../domain/entities/booking/Booking';
import type {
	ExperienceSnapshot,
	ExperienceInfo,
} from '../../../domain/entities/booking/Booking';
import { BookingDocument } from '../../persistence/booking/booking.schema';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateBookingDto } from '../../controllers/dto/booking/CreateBookingDto';
import { Types } from 'mongoose';
import { Experience } from '../../../domain/entities/experiences/Experience';
import { ExperiencePrices } from '../../../domain/entities/experiences/ExperiencePrices';

type CreateBookingInput = CreateBookingDto & {
	status?: BookingStatus;
	payment?: CreateBookingDto['payment'];
};

export class BookingMapper {
	static fromDocument(doc: BookingDocument): Booking {
		const plain = doc.toObject();
		return plainToInstance(Booking, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(
		dto: CreateBookingInput,
		experience: Experience,
		prices: ExperiencePrices,
	): Booking {
		const now = new Date();
		const id = new Types.ObjectId().toString();
		const experienceInfo = this.resolveExperienceInfo(
			dto.experienceId,
			experience,
			prices,
		);

		return plainToInstance(Booking, {
			id: id,
			...dto,
			status: dto.status ?? BookingStatus.PENDING,
			experience: experienceInfo,
			createdAt: now,
			updatedAt: now,
		});
	}

	static toPersistence(booking: Booking | Partial<Booking>) {
		const plain = instanceToPlain(booking);
		const { id: _id1, _id: _id2, __v: _v, ...dataForDB } = plain;
		return {
			...dataForDB,
		};
	}

	// -- Resolve functions

	static resolveExperienceSnapshot(
		experience: Experience,
		prices: ExperiencePrices,
	): ExperienceSnapshot {
		return {
			name: experience.basicInfo.title,
			days: experience.basicInfo.days,
			nights: experience.basicInfo.nights,
			ageGroupPricing: prices.ageGroups.map((ag) => ({
				code: ag.code,
				label: ag.label,
				minAge: ag.minAge,
				maxAge: ag.maxAge,
				price: ag.price,
			})),
		};
	}

	static resolveExperienceInfo(
		experienceId: string,
		experience: Experience,
		prices: ExperiencePrices,
	): ExperienceInfo {
		return {
			experienceId,
			experienceSnapshot: this.resolveExperienceSnapshot(experience, prices),
		};
	}
}

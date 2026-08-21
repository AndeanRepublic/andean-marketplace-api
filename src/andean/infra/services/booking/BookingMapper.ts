import { Booking } from '../../../domain/entities/booking/Booking';
import type {
	AgeGroupPricing,
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
import { AgeGroupCode } from '../../../domain/enums/AgeGroupCode';

type CreateBookingInput = CreateBookingDto & {
	status?: BookingStatus;
	payment?: CreateBookingDto['payment'];
};

const FLAT_RATE_AGE_GROUPS: ReadonlyArray<{
	code: AgeGroupCode;
	label: string;
	minAge: number;
	maxAge: number;
}> = [
	{ code: AgeGroupCode.YOUNG, label: 'Jóvenes', minAge: 18, maxAge: 25 },
	{ code: AgeGroupCode.ADULTS, label: 'Adultos', minAge: 26, maxAge: 60 },
	{ code: AgeGroupCode.TEEN, label: 'Adolescentes', minAge: 11, maxAge: 17 },
	{ code: AgeGroupCode.CHILD, label: 'Niños', minAge: 2, maxAge: 10 },
	{ code: AgeGroupCode.BABY, label: 'Bebés', minAge: 0, maxAge: 1 },
];

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
		const { id, _id, __v, ...dataForDB } = plain;
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
			ageGroupPricing: this.resolveSnapshotAgeGroupPricing(prices),
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

	static resolveSnapshotAgeGroupPricing(
		prices: ExperiencePrices,
	): AgeGroupPricing[] {
		if (prices.useAgeBasedPricing) {
			return (prices.ageGroups ?? []).map((ag) => ({
				code: ag.code,
				label: ag.label,
				minAge: ag.minAge,
				maxAge: ag.maxAge,
				price: ag.price,
			}));
		}

		const general =
			(prices.ageGroups ?? []).find(
				(ag) => ag.code === AgeGroupCode.GENERAL,
			) ?? prices.ageGroups?.[0];
		const price = general?.price ?? 0;

		return FLAT_RATE_AGE_GROUPS.map((group) => ({
			...group,
			price,
		}));
	}
}

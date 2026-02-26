import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { BookingRepository } from '../../datastore/booking/Booking.repo';

@Injectable()
export class GetFutureUnavailableDatesUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepository: ExperienceAvailabilityRepository,
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(experienceId: string): Promise<Date[]> {
		const experience = await this.experienceRepository.getById(experienceId);
		if (!experience) return [];

		const availability = await this.availabilityRepository.getById(
			experience.availabilityId,
		);
		if (!availability || !availability.excludedDates?.length) return [];

		const daysExperience = experience.basicInfo?.days;
		if (!daysExperience) {
			throw new BadRequestException('Experience days are not available');
		}

		const now = new Date();
		now.setHours(0, 0, 0, 0);

		const nonAvailableDates: Date[] = [];

		const excludedDates = [...(availability.excludedDates ?? [])];
		for (const excludedDate of excludedDates) {
			nonAvailableDates.push(
				...this.expandBlockedDateToStartDates(
					excludedDate,
					daysExperience,
					now,
				),
			);
		}

		const futureBookings =
			await this.bookingRepository.getFutureBookings(experienceId);
		for (const futureBooking of futureBookings) {
			nonAvailableDates.push(
				...this.expandBlockedDateToStartDates(
					futureBooking,
					daysExperience,
					now,
				),
			);
			nonAvailableDates.push(
				...this.expandBlockedDateToExperienceDates(
					futureBooking,
					daysExperience,
					now,
				),
			);
		}

		const uniqueDates = [...new Set(nonAvailableDates.map((d) => d.getTime()))]
			.map((t) => new Date(t))
			.sort((a, b) => a.getTime() - b.getTime());

		return uniqueDates;
	}

	private expandBlockedDateToStartDates(
		blockedDate: Date | string,
		durationDays: number,
		fromDate: Date,
	): Date[] {
		const date = new Date(blockedDate);
		if (date < fromDate) return [];

		const result: Date[] = [];
		for (let offset = 0; offset < durationDays; offset++) {
			const startDate = new Date(date);
			startDate.setDate(startDate.getDate() - offset);
			if (startDate >= fromDate) {
				result.push(startDate);
			}
		}
		return result;
	}

	private expandBlockedDateToExperienceDates(
		blockedDate: Date | string,
		experienceDays: number,
		fromDate: Date,
	): Date[] {
		const date = new Date(blockedDate);
		if (date < fromDate) return [];

		const result: Date[] = [];
		for (let offset = 0; offset < experienceDays; offset++) {
			const startDate = new Date(date);
			startDate.setDate(startDate.getDate() + offset);
			if (startDate >= fromDate) {
				result.push(startDate);
			}
		}
		return result;
	}
}

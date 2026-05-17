import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from 'src/andean/app/datastore/experiences/Experience.repo';
import { ExperienceAvailabilityRepository } from 'src/andean/app/datastore/experiences/ExperienceAvailability.repo';
import { BookingRepository } from 'src/andean/app/datastore/booking/Booking.repo';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';
import { ExperienceSharedCapacityRangeResponse } from 'src/andean/app/models/experiences/ExperienceSharedCapacityRangeResponse';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_WINDOW_DAYS = 30;
const MAX_WINDOW_DAYS = 92;

@Injectable()
export class GetSharedCapacityByDateRangeUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepository: ExperienceAvailabilityRepository,
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
	) {}

	async handle(
		experienceId: string,
		params: { from?: string; to?: string },
	): Promise<ExperienceSharedCapacityRangeResponse> {
		const experience = await this.experienceRepository.getById(experienceId);
		if (!experience) {
			throw new NotFoundException('Experience not found');
		}

		const availability = await this.availabilityRepository.getById(
			experience.availabilityId,
		);
		if (!availability) {
			throw new NotFoundException('Experience availability not found');
		}
		if (availability.mode !== ExperienceAvailabilityMode.SHARED_CAPACITY) {
			throw new BadRequestException(
				'Shared capacity endpoint is only available for sharedCapacity experiences',
			);
		}

		const { from, to } = this.resolveRange(params.from, params.to);
		const excludedSet = new Set(
			(availability.excludedDates ?? []).map((d) => this.toDateKey(new Date(d))),
		);

		const specificCandidates = (availability.specificAvailableStartDates ?? [])
			.map((d) => this.normalizeDateUtc(new Date(d)))
			.filter((d) => d >= from && d <= to);

		const weeklyCandidates = this.generateWeeklyCandidates(
			from,
			to,
			availability.weeklyStartDays ?? [],
		);

		const candidateMap = new Map<number, Date>();
		for (const d of [...specificCandidates, ...weeklyCandidates]) {
			const key = d.getTime();
			if (!candidateMap.has(key) && !excludedSet.has(this.toDateKey(d))) {
				candidateMap.set(key, d);
			}
		}

		const candidateDates = [...candidateMap.values()].sort(
			(a, b) => a.getTime() - b.getTime(),
		);

		const items = await Promise.all(
			candidateDates.map(async (date) => {
				const reservedGuests =
					await this.bookingRepository.getTotalGuestsReservedForDate(
						experienceId,
						date,
					);
				return {
					date,
					maxCapacity: experience.basicInfo.maxNumberGroup,
					reservedGuests,
					remainingGuests: Math.max(
						0,
						experience.basicInfo.maxNumberGroup - reservedGuests,
					),
				};
			}),
		);

		return {
			experienceId,
			from,
			to,
			totalDates: items.length,
			items,
		};
	}

	private resolveRange(fromRaw?: string, toRaw?: string): { from: Date; to: Date } {
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		const from = fromRaw
			? this.normalizeDateUtc(new Date(fromRaw))
			: new Date(today);
		const to = toRaw
			? this.normalizeDateUtc(new Date(toRaw))
			: new Date(from.getTime() + (DEFAULT_WINDOW_DAYS - 1) * MS_PER_DAY);

		if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
			throw new BadRequestException('Invalid from/to date');
		}
		if (from > to) {
			throw new BadRequestException('"from" cannot be after "to"');
		}

		const diffDays = Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY) + 1;
		if (diffDays > MAX_WINDOW_DAYS) {
			throw new BadRequestException(
				`Date range too large. Max allowed is ${MAX_WINDOW_DAYS} days`,
			);
		}

		return { from, to };
	}

	private generateWeeklyCandidates(
		from: Date,
		to: Date,
		weeklyStartDays: number[],
	): Date[] {
		if (!weeklyStartDays.length) return [];
		const allowed = new Set(weeklyStartDays);
		const result: Date[] = [];
		for (let ts = from.getTime(); ts <= to.getTime(); ts += MS_PER_DAY) {
			const d = new Date(ts);
			if (allowed.has(d.getUTCDay())) {
				result.push(d);
			}
		}
		return result;
	}

	private normalizeDateUtc(date: Date): Date {
		const d = new Date(date);
		d.setUTCHours(0, 0, 0, 0);
		return d;
	}

	private toDateKey(date: Date): string {
		return this.normalizeDateUtc(date).toISOString().slice(0, 10);
	}
}


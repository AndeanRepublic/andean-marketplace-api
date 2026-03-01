import { WeekDay } from '../../enums/WeekDay';
import { ExperienceAvailabilityMode } from '../../enums/ExperienceAvailabilityMode';

export class ExperienceAvailability {
	constructor(
		public id: string,
		public mode: ExperienceAvailabilityMode,
		public weeklyStartDays: WeekDay[],
		public specificAvailableStartDates: Date[],
		public excludedDates: Date[],
	) {}
}

import { WeekDay } from '../../enums/WeekDay';

export class ExperienceAvailability {
	constructor(
		public id: string,
		public weeklyStartDays: WeekDay[],
		public specificAvailableStartDates: Date[],
		public excludedDates: Date[],
	) {}
}

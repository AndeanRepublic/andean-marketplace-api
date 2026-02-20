import { WeekDay } from '../../enums/WeekDay';

export class ExperienceAvailability {
	constructor(
		public id: string,
		public weeklyStartDays: WeekDay[],
		public specificAvailableDates: Date[],
		public excludedDates: Date[],
	) { }
}

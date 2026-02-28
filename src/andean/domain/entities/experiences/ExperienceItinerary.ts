import { ItinerarySchedule } from './ItinerarySchedule';

export class ExperienceItinerary {
	constructor(
		public id: string,
		public numberDay: number,
		public nameDay: string,
		public descriptionDay: string,
		public photos: string[],
		public schedule: ItinerarySchedule[],
	) {}
}

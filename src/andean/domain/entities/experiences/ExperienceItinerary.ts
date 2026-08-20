import { ItinerarySchedule } from './ItinerarySchedule';
import { ItineraryMeals } from './ItineraryMeals';

export class ExperienceItinerary {
	constructor(
		public id: string,
		public numberDay: number,
		public nameDay: string,
		public descriptionDay: string,
		public photos: string[],
		public schedule: ItinerarySchedule[],
		public meals?: ItineraryMeals,
	) { }
}

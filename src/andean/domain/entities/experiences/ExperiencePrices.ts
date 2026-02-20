import { AgeGroup } from './AgeGroup';

export class ExperiencePrices {
	constructor(
		public id: string,
		public useAgeBasedPricing: boolean,
		public currency: string,
		public ageGroups: AgeGroup[],
	) { }
}

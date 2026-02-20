import { ExperienceStatus } from '../../enums/ExperienceStatus';

export class Experience {
	constructor(
		public id: string,
		public status: ExperienceStatus,
		public basicInfoId: string,
		public mediaInfoId: string,
		public detailInfoId: string,
		public pricesId: string,
		public availabilityId: string,
		public itineraryIds: string[],
		public createdAt: Date,
		public updatedAt: Date,
	) { }
}

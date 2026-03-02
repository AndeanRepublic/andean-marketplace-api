import { ExperienceStatus } from '../../enums/ExperienceStatus';
import { ExperienceBasicInfo } from './ExperienceBasicInfo';
import { ExperienceMediaInfo } from './ExperienceMediaInfo';
import { ExperienceDetailInfo } from './ExperienceDetailInfo';

export class Experience {
	constructor(
		public id: string,
		public status: ExperienceStatus,
		public basicInfo: ExperienceBasicInfo,
		public mediaInfo: ExperienceMediaInfo,
		public detailInfo: ExperienceDetailInfo,
		public pricesId: string,
		public availabilityId: string,
		public itineraryIds: string[],
		public createdAt: Date,
		public updatedAt: Date,
	) { }
}

import { ExperienceLanguage } from '../../enums/ExperienceLanguage';
import { OwnerType } from '../../enums/OwnerType';

export class ExperienceBasicInfo {
	constructor(
		public id: string,
		public title: string,
		public ubication: string,
		public days: number,
		public nights: number,
		public minNumberGroup: number,
		public maxNumberGroup: number,
		public languages: ExperienceLanguage[],
		public ownerType: OwnerType,
		public ownerId: string,
		public category?: string,
	) { }
}

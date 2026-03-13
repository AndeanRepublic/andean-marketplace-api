import { ExperienceLanguage } from '../../enums/ExperienceLanguage';
import { OwnerType } from '../../enums/OwnerType';

// Value Object — no tiene identidad propia, vive embebido en Experience
export class ExperienceBasicInfo {
	constructor(
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

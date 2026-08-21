import { ExperienceLanguage } from '../../enums/ExperienceLanguage';
import { OwnerType } from '../../enums/OwnerType';
import { ExperienceDurationUnit } from '../../enums/ExperienceDurationUnit';

// Value Object — no tiene identidad propia, vive embebido en Experience
export class ExperienceBasicInfo {
	constructor(
		public title: string,
		public ubication: string,
		public days: number,
		public nights: number,
		public durationUnit: ExperienceDurationUnit,
		public minNumberGroup: number,
		public maxNumberGroup: number,
		public languages: ExperienceLanguage[],
		public ownerType: OwnerType,
		public ownerId: string,
		public includesPickup: boolean,
		public includesAccommodation: boolean,
		public includesReturn: boolean,
		public hours?: number,
		public categoryId?: string,
		public category?: string,
	) {}
}

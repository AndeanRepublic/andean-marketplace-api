import { ExperienceCategoryStatus } from '../../enums/ExperienceCategoryStatus';

export class ExperienceCategory {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly status: ExperienceCategoryStatus,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}

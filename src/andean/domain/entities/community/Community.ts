import { AdminEntityStatus } from '../../enums/AdminEntityStatus';

export class Community {
	constructor(
		public id: string,
		public name: string,
		public bannerImageId: string,
		public status: AdminEntityStatus,
		public createdAt: Date,
		public updatedAt: Date,
		public seals?: string[],
		public providerInfoId?: string,
	) {}
}

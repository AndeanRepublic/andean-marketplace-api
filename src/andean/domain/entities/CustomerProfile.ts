import { CoinType } from '../enums/CoinType';

export class CustomerProfile {
	constructor(
		public id: string,
		public userId: string,
		public country?: string,
		public phoneNumber?: string,
		public language?: string,
		public coin?: CoinType,
		public birthDate?: Date,
		public profilePictureMediaId?: string,
	) {}
}

import { CoinType } from '../enums/CoinType';

export class CustomerProfile {
	constructor(
		public id: string,
		public userId: string,
		public name: string,
		public country: string,
		public phoneNumber: string,
		public language: string,
		public coin: CoinType,
		public profilePictureMediaId?: string,
	) {}
}

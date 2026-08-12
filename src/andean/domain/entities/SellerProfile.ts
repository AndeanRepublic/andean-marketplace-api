import { PersonType } from '../enums/PersonType';
import { SellerStatus } from '../enums/SellerStatus';

export class SellerProfile {
	constructor(
		public id: string,
		public userId: string,
		public name: string,
		public typePerson: PersonType,
		public numberDocument: string,
		public ruc: string,
		public address: string,
		public phoneNumber: string,
		public status: SellerStatus,
		public rejectionReason?: string,
	) {}
}

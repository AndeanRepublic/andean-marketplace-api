import { AccountStatus } from '../enums/AccountStatus';
import { AccountRole } from '../enums/AccountRole';

export class Account {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public password: string,
		public status: AccountStatus,
		public roles: AccountRole[],
	) {}
}

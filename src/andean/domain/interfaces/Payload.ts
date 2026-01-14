import { AccountRole } from '../enums/AccountRole';

export interface Payload {
	sub: string;
	roles: AccountRole[];
}

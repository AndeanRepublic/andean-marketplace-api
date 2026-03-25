import { AccountRole } from '../../../domain/enums/AccountRole';

export interface Payload {
	sub: string;
	roles: AccountRole[];
}

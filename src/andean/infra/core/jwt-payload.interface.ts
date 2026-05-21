import { AccountRole } from '../../domain/enums/AccountRole';

export interface JwtPayload {
	sub: string;
	roles: AccountRole[];
	passwordVersion?: number;
}

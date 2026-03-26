import { Account } from '../../domain/entities/Account';
import { AccountStatus } from '../../domain/enums/AccountStatus';
import { AccountRole } from '../../domain/enums/AccountRole';

export abstract class AccountRepository {
	abstract getAccountById(id: string): Promise<Account | null>;
	abstract saveAccount(account: Account): Promise<Account>;
	abstract getAccountByEmail(email: string): Promise<Account | null>;
	abstract updateAccountStatus(
		accountId: string,
		status: AccountStatus,
	): Promise<void>;
	abstract updateAccountRoles(
		accountId: string,
		roles: AccountRole[],
	): Promise<void>;
}

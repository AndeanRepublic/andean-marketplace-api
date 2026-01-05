import { Account } from '../../domain/entities/Account';
import { AccountStatus } from '../../domain/enums/AccountStatus';

export abstract class AccountRepository {
  abstract getAccountByUserId(userId: string): Promise<Account | null>;
  abstract saveAccount(account: Account): Promise<Account>;
  abstract getAccountByEmail(email: string): Promise<Account | null>;
  abstract updateAccountStatus(
    accountId: string,
    status: AccountStatus,
  ): Promise<void>;
  // deleteAccountByUserId(userId: string): Promise<void>;
}

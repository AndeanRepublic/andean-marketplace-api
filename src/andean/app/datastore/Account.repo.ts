import { Account } from '../../domain/entities/Account';

export abstract class AccountRepository {
  abstract getAccountByUserId(userId: string): Promise<Account | null>;
  abstract saveAccount(account: Account): Promise<Account>;
  // updateAccount(account: Account): Promise<void>;
  // deleteAccountByUserId(userId: string): Promise<void>;
}

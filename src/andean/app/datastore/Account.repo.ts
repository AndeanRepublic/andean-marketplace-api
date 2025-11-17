import { Account } from '../../domain/entities/Account';

export abstract class AccountRepository {
  abstract getAccountByUserId(userId: string): Promise<Account | null>;
  abstract saveAccount(account: Account): Promise<Account>;
  abstract getAccountByEmail(email: string): Promise<Account | null>;
  // updateAccount(account: Account): Promise<void>;
  // deleteAccountByUserId(userId: string): Promise<void>;
}

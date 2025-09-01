import { AccountStatus } from '../enums/AccountStatus';
import { AccountType } from '../enums/AccountType';

export class Account {
  constructor(
    public userId: string,
    public password: string,
    public status: AccountStatus,
    public type: AccountType,
  ) {}
}

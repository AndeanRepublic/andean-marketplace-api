import { BankAccountStatus } from '../enums/BankAccountStatus';
import { BankAccountType } from '../enums/BankAccountType';

export class SellerBankAccount {
  constructor(
    public id: string,
    public sellerId: string,
    public status: BankAccountStatus,
    public type: BankAccountType,
    public cci: string,
    public bank: string,
  ) {}
}

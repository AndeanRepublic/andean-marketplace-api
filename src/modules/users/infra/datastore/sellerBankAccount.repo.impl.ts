import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SellerBankAccountRepository } from '../../app/datastore/SellerBankAccount.repo';
import { Model } from 'mongoose';
import { BankAccountDocument } from '../persistence/bankAccount.schema';
import { SellerBankAccount } from '../../domain/entities/SellerBankAccount';
import { BankAccountMapper } from '../services/BankAccountMapper';

@Injectable()
export class SellerBankAccountRepoImpl extends SellerBankAccountRepository {
  constructor(
    @InjectModel('BankAccount')
    private readonly bankAccountModel: Model<BankAccountDocument>,
  ) {
    super();
  }

  async saveBankAccount(
    bankAccount: SellerBankAccount,
  ): Promise<SellerBankAccount> {
    const created = new this.bankAccountModel({
      _id: crypto.randomUUID(),
      id: bankAccount.id,
      sellerId: bankAccount.sellerId,
      status: bankAccount.status,
      type: bankAccount.type,
      cci: bankAccount.cci,
      bank: bankAccount.bank,
    });
    const savedBankAccount = await created.save();
    return BankAccountMapper.toDomain(savedBankAccount);
  }

  async getBankAccountById(id: string): Promise<SellerBankAccount | null> {
    const doc = await this.bankAccountModel.findById(id).exec();
    return doc ? BankAccountMapper.toDomain(doc) : null;
  }

  async getBankAccountsBySellerId(
    sellerId: string,
  ): Promise<SellerBankAccount[]> {
    const docs = await this.bankAccountModel.find({ sellerId }).exec();
    return docs.map((doc: BankAccountDocument) =>
      BankAccountMapper.toDomain(doc),
    );
  }

  async deleteBankAccount(id: string): Promise<void> {
    await this.bankAccountModel.findByIdAndDelete({ id }).exec();
  }
}

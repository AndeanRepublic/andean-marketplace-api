import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../app/datastore/Account.repo';
import { InjectModel } from '@nestjs/mongoose';
import { AccountDocument } from '../persistence/account.schema';
import { Model } from 'mongoose';
import { Account } from '../../domain/entities/Account';
import { AccountMapper } from '../services/AccountMapper';

@Injectable()
export class AccountRepoImpl extends AccountRepository {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>,
  ) {
    super();
  }

  async getAccountByUserId(userId: string): Promise<Account | null> {
    const doc = await this.accountModel.findOne({ userId }).exec();
    return doc ? AccountMapper.toDomain(doc) : null;
  }

  async saveAccount(account: Account): Promise<Account> {
    const created = new this.accountModel({
      _id: crypto.randomUUID(),
      userId: account.userId,
      password: account.password,
      type: account.type,
      status: account.status,
    });
    const savedAccount = await created.save();
    return new Account(
      savedAccount.userId,
      savedAccount.password,
      savedAccount.status,
      savedAccount.type,
    );
  }
}

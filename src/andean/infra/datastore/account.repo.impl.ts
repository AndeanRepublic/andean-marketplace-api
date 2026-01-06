import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../app/datastore/Account.repo';
import { InjectModel } from '@nestjs/mongoose';
import { AccountDocument } from '../persistence/account.schema';
import { Model } from 'mongoose';
import { Account } from '../../domain/entities/Account';
import { AccountMapper } from '../services/AccountMapper';
import { HashService } from '../services/HashService';

@Injectable()
export class AccountRepoImpl extends AccountRepository {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>,
    private readonly hashService: HashService,
  ) {
    super();
  }

  async getAccountByUserId(userId: string): Promise<Account | null> {
    const doc = await this.accountModel.findOne({ userId }).exec();
    return doc ? AccountMapper.toDomain(doc) : null;
  }

  async saveAccount(account: Account): Promise<Account> {
    const hashedPassword = await this.hashService.hash(account.password);
    const created = new this.accountModel({
      _id: crypto.randomUUID(),
      userId: account.userId,
      name: account.name,
      email: account.email,
      password: hashedPassword,
      type: account.role,
      status: account.status,
    });
    const savedAccount = await created.save();
    return new Account(
      savedAccount.userId,
      savedAccount.name,
      savedAccount.email,
      savedAccount.password,
      savedAccount.status,
      savedAccount.type,
    );
  }

  async getAccountByEmail(email: string): Promise<Account | null> {
    const doc = await this.accountModel.findOne({ email }).exec();
    return doc ? AccountMapper.toDomain(doc) : null;
  }
}

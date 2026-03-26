import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../app/datastore/Account.repo';
import { InjectModel } from '@nestjs/mongoose';
import { AccountDocument } from '../persistence/account.schema';
import { Model, Types } from 'mongoose';
import { Account } from '../../domain/entities/Account';
import { AccountMapper } from '../services/AccountMapper';
import { HashService } from '../services/HashService';
import { AccountStatus } from '../../domain/enums/AccountStatus';
import { AccountRole } from '../../domain/enums/AccountRole';

@Injectable()
export class AccountRepoImpl extends AccountRepository {
	constructor(
		@InjectModel('Account')
		private readonly accountModel: Model<AccountDocument>,
		private readonly hashService: HashService,
	) {
		super();
	}

	async getAccountById(id: string): Promise<Account | null> {
		// Convertir string a ObjectId para MongoDB
		const objectId = new Types.ObjectId(id);
		const doc = await this.accountModel.findById(objectId).exec();
		return doc ? AccountMapper.fromDocument(doc) : null;
	}

	async saveAccount(account: Account): Promise<Account> {
		const hashedPassword = await this.hashService.hash(account.password);
		const created = new this.accountModel({
			name: account.name,
			email: account.email,
			password: hashedPassword,
			type: account.roles,
			status: account.status,
		});
		const savedAccount = await created.save();
		return AccountMapper.fromDocument(savedAccount);
	}

	async getAccountByEmail(email: string): Promise<Account | null> {
		const doc = await this.accountModel.findOne({ email }).exec();
		return doc ? AccountMapper.fromDocument(doc) : null;
	}

	async updateAccountStatus(
		accountId: string,
		status: AccountStatus,
	): Promise<void> {
		await this.accountModel.findByIdAndUpdate(accountId, { status }).exec();
	}

	async updateAccountRoles(
		accountId: string,
		roles: AccountRole[],
	): Promise<void> {
		await this.accountModel
			.findByIdAndUpdate(accountId, { type: roles })
			.exec();
	}
}

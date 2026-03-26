import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../app/datastore/Account.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountDocument } from '../persistence/account.schema';
import { Account } from '../../domain/entities/Account';
import { AccountMapper } from '../services/AccountMapper';

/**
 * Implementación de AccountRepository para uso en módulos que solo necesitan
 * leer accounts (sin necesidad de HashService para crear/actualizar passwords)
 */
@Injectable()
export class AccountReviewRepositoryImpl extends AccountRepository {
	constructor(
		@InjectModel('Account')
		private readonly accountModel: Model<AccountDocument>,
	) {
		super();
	}

	async getAccountById(id: string): Promise<Account | null> {
		// Convertir string a ObjectId para MongoDB
		const objectId = new Types.ObjectId(id);
		const doc = await this.accountModel.findById(objectId).exec();
		return doc ? AccountMapper.fromDocument(doc) : null;
	}

	async saveAccount(_account: Account): Promise<Account> {
		throw new Error('Not implemented: use AccountRepoImpl from UsersModule');
	}

	async getAccountByEmail(_email: string): Promise<Account | null> {
		throw new Error('Not implemented: use AccountRepoImpl from UsersModule');
	}

	async updateAccountStatus(_accountId: string, _status: any): Promise<void> {
		throw new Error('Not implemented: use AccountRepoImpl from UsersModule');
	}

	async updateAccountRoles(_accountId: string, _roles: any[]): Promise<void> {
		throw new Error('Not implemented: use AccountRepoImpl from UsersModule');
	}
}

import { Injectable } from '@nestjs/common';
import { SellerBankAccountRepository } from '../../datastore/SellerBankAccount.repo';

@Injectable()
export class DeleteBankAccountUseCase {
	constructor(
		private readonly bankAccountRepository: SellerBankAccountRepository,
	) {}

	async handle(accountId: string): Promise<void> {
		return this.bankAccountRepository.deleteBankAccount(accountId);
	}
}

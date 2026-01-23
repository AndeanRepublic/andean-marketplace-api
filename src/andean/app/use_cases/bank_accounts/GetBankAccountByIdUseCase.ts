import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerBankAccountRepository } from '../../datastore/SellerBankAccount.repo';
import { SellerBankAccount } from '../../../domain/entities/SellerBankAccount';

@Injectable()
export class GetBankAccountByIdUseCase {
	constructor(
		private readonly bankAccountRepository: SellerBankAccountRepository,
	) {}

	async handle(bankAccountId: string): Promise<SellerBankAccount> {
		const accountFound =
			await this.bankAccountRepository.getBankAccountById(bankAccountId);
		if (!accountFound) {
			throw new NotFoundException();
		}
		return accountFound;
	}
}

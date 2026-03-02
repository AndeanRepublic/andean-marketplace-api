import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerBankAccountRepository } from '../../datastore/SellerBankAccount.repo';
import { SellerBankAccount } from '../../../domain/entities/SellerBankAccount';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

@Injectable()
export class GetBankAccountsBySellerUseCase {
	constructor(
		private readonly sellerRepository: SellerProfileRepository,
		private readonly bankAccountRepository: SellerBankAccountRepository,
	) {}

	async handle(sellerId: string): Promise<SellerBankAccount[]> {
		const sellerFound = await this.sellerRepository.getSellerById(sellerId);
		if (!sellerFound) {
			throw new NotFoundException();
		}
		return this.bankAccountRepository.getBankAccountsBySellerId(sellerId);
	}
}

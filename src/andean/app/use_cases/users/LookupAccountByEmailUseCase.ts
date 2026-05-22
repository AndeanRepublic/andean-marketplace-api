import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AdminAccountLookupResponse } from '../../models/users/AdminAccountLookupResponse';
import { normalizeEmail } from '../../utils/normalizeEmail';

@Injectable()
export class LookupAccountByEmailUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
	) {}

	async handle(email: string): Promise<AdminAccountLookupResponse> {
		const normalized = normalizeEmail(email);
		const account = await this.accountRepository.getAccountByEmail(normalized);
		if (!account) {
			throw new NotFoundException('Usuario no encontrado');
		}

		const seller = await this.sellerRepository.getSellerByUserId(account.id);

		return {
			id: account.id,
			name: account.name,
			email: account.email,
			status: account.status,
			roles: account.roles,
			hasSellerProfile: !!seller,
			sellerStatus: seller?.status,
		};
	}
}

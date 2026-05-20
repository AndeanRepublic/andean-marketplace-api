import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';

@Injectable()
export class CreateSellerUseCase {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {}

	async handle(sellerDto: CreateSellerDto): Promise<SellerProfile> {
		const accountFound = await this.accountRepository.getAccountById(
			sellerDto.userId,
		);
		if (!accountFound) {
			throw new ConflictException('Usuario no encontrado');
		}

		const accountId = accountFound.id;

		if (!accountFound.roles.includes(AccountRole.SELLER)) {
			const updatedRoles = [...accountFound.roles, AccountRole.SELLER];
			await this.accountRepository.updateAccountRoles(accountId, updatedRoles);
		}

		const sellerToSave = SellerProfileMapper.fromCreateDto(
			accountId,
			sellerDto,
		);
		await this.sellerRepository.saveSeller(sellerToSave);
		return sellerToSave;
	}
}

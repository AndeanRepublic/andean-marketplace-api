import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { Account } from '../../../domain/entities/Account';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { CreateAdminSellerWithAccountDto } from '../../../infra/controllers/dto/admin/CreateAdminSellerWithAccountDto';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { CreateSellerUseCase } from './CreateSellerUseCase';
import { SellerCreationMode } from '../../../domain/enums/SellerCreationMode';
import { normalizeEmail } from '../../utils/normalizeEmail';

@Injectable()
export class CreateAdminSellerWithAccountUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		private readonly createSellerUseCase: CreateSellerUseCase,
	) {}

	async handle(
		dto: CreateAdminSellerWithAccountDto,
	): Promise<SellerProfileResponse> {
		const normalized = normalizeEmail(dto.email);
		const existing = await this.accountRepository.getAccountByEmail(normalized);
		if (existing) {
			throw new ConflictException('Email already in use');
		}

		const accountToSave: Account = {
			id: '',
			name: dto.accountName,
			email: normalized,
			password: dto.password,
			status: AccountStatus.ENABLED,
			roles: [AccountRole.USER],
		};
		const savedAccount =
			await this.accountRepository.saveAccount(accountToSave);

		const createDto: CreateSellerDto = {
			userId: savedAccount.id,
			typePerson: dto.typePerson,
			numberDocument: dto.numberDocument,
			ruc: dto.ruc,
			name: dto.name,
			address: dto.address,
			phoneNumber: dto.phoneNumber,
		};

		const seller = await this.createSellerUseCase.handle(
			createDto,
			SellerCreationMode.ADMIN,
		);
		return SellerProfileMapper.toResponse(seller);
	}
}

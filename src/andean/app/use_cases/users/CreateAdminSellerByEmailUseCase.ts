import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { CreateAdminSellerByEmailDto } from '../../../infra/controllers/dto/admin/CreateAdminSellerByEmailDto';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { CreateSellerUseCase } from './CreateSellerUseCase';
import { SellerCreationMode } from '../../../domain/enums/SellerCreationMode';
import { normalizeEmail } from '../../utils/normalizeEmail';

@Injectable()
export class CreateAdminSellerByEmailUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		private readonly createSellerUseCase: CreateSellerUseCase,
	) {}

	async handle(dto: CreateAdminSellerByEmailDto): Promise<SellerProfileResponse> {
		const normalized = normalizeEmail(dto.email);
		const account = await this.accountRepository.getAccountByEmail(normalized);
		if (!account) {
			throw new NotFoundException('Usuario no encontrado');
		}

		const createDto: CreateSellerDto = {
			userId: account.id,
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

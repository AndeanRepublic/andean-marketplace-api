import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { Account } from '../../../domain/entities/Account';
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
		let accountFound: Account | null = null;
		let userId: string;

		// Si se proporciona userId, buscar por userId
		if (sellerDto.userId) {
			accountFound = await this.accountRepository.getAccountByUserId(
				sellerDto.userId,
			);
			if (!accountFound) {
				throw new ConflictException('Usuario no encontrado');
			}
			userId = accountFound.userId;

			// Agregar el rol SELLER si no lo tiene
			if (!accountFound.roles.includes(AccountRole.SELLER)) {
				const updatedRoles = [...accountFound.roles, AccountRole.SELLER];
				await this.accountRepository.updateAccountRoles(userId, updatedRoles);
			}
		} else {
			// Si no se proporciona userId, buscar por email o crear nueva cuenta
			if (!sellerDto.email || !sellerDto.password) {
				throw new ConflictException(
					'Email y contraseña son requeridos si no se proporciona userId',
				);
			}

			accountFound = await this.accountRepository.getAccountByEmail(
				sellerDto.email,
			);

			if (accountFound) {
				// Si la cuenta ya existe, agregar el rol SELLER si no lo tiene
				userId = accountFound.userId;

				if (!accountFound.roles.includes(AccountRole.SELLER)) {
					const updatedRoles = [...accountFound.roles, AccountRole.SELLER];
					await this.accountRepository.updateAccountRoles(userId, updatedRoles);
				}
			} else {
				// Si no existe, crear una nueva cuenta
				userId = crypto.randomUUID();
				const accountToSave: Account = {
					userId: userId,
					name: sellerDto.name,
					email: sellerDto.email,
					password: sellerDto.password,
					status: AccountStatus.PENDING,
					roles: [AccountRole.SELLER],
				};
				await this.accountRepository.saveAccount(accountToSave);
			}
		}

		const sellerToSave = SellerProfileMapper.fromCreateDto(userId, sellerDto);
		await this.sellerRepository.saveSeller(sellerToSave);
		return sellerToSave;
	}
}

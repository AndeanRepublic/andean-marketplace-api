import {

	ConflictException,

	Inject,

	Injectable,

	UnauthorizedException,

} from '@nestjs/common';

import { SellerProfileRepository } from '../../datastore/Seller.repo';

import { SellerProfile } from '../../../domain/entities/SellerProfile';

import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';

import { AccountRepository } from '../../datastore/Account.repo';

import { AccountStatus } from '../../../domain/enums/AccountStatus';

import { SellerStatus } from '../../../domain/enums/SellerStatus';

import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';

import { SellerCreationMode } from '../../../domain/enums/SellerCreationMode';

import { AccountRole } from '../../../domain/enums/AccountRole';



@Injectable()

export class CreateSellerUseCase {

	constructor(

		@Inject(SellerProfileRepository)

		private readonly sellerRepository: SellerProfileRepository,

		@Inject(AccountRepository)

		private readonly accountRepository: AccountRepository,

	) {}



	async handle(

		sellerDto: CreateSellerDto,

		mode: SellerCreationMode = SellerCreationMode.APPLICATION,

	): Promise<SellerProfile> {

		const accountFound = await this.accountRepository.getAccountById(

			sellerDto.userId,

		);

		if (!accountFound) {

			throw new ConflictException('Usuario no encontrado');

		}

		if (accountFound.status !== AccountStatus.ENABLED) {

			throw new UnauthorizedException('Cuenta no habilitada');

		}



		const targetStatus =

			mode === SellerCreationMode.ADMIN

				? SellerStatus.APPROVED

				: SellerStatus.PENDING;



		const existing = await this.sellerRepository.getSellerByUserId(

			sellerDto.userId,

		);



		if (existing) {

			if (

				existing.status === SellerStatus.PENDING ||

				existing.status === SellerStatus.APPROVED

			) {

				throw new ConflictException(

					'Ya existe una solicitud o perfil de vendedor activo',

				);

			}



			if (existing.status === SellerStatus.REJECTED) {

				const updated = new SellerProfile(

					existing.id,

					existing.userId,

					sellerDto.name,

					sellerDto.typePerson,

					sellerDto.numberDocument,

					sellerDto.ruc ?? '',

					sellerDto.address,

					sellerDto.phoneNumber,

					targetStatus,

				);

				await this.sellerRepository.updateSellerByUserId(

					sellerDto.userId,

					updated,

				);

				if (mode === SellerCreationMode.ADMIN) {

					await this.grantSellerRole(sellerDto.userId);

				}

				return updated;

			}

		}



		const sellerToSave = SellerProfileMapper.fromCreateDto(

			accountFound.id,

			sellerDto,

			targetStatus,

		);

		const saved = await this.sellerRepository.saveSeller(sellerToSave);



		if (mode === SellerCreationMode.ADMIN) {

			await this.grantSellerRole(sellerDto.userId);

		}



		return saved;

	}



	private async grantSellerRole(userId: string): Promise<void> {

		const account = await this.accountRepository.getAccountById(userId);

		if (!account) {

			return;

		}

		if (!account.roles.includes(AccountRole.SELLER)) {

			await this.accountRepository.updateAccountRoles(userId, [

				...account.roles,

				AccountRole.SELLER,

			]);

		}

	}

}



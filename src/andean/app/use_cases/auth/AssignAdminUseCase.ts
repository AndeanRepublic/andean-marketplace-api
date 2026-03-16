import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AssignAdminDto } from '../../../infra/controllers/dto/AssignAdminDto';

@Injectable()
export class AssignAdminUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {}

	async handle(dto: AssignAdminDto): Promise<void> {
		const account = await this.accountRepository.getAccountByEmail(dto.email);

		if (!account) {
			throw new NotFoundException('Account not found');
		}

		if (account.roles.includes(AccountRole.ADMIN)) {
			return;
		}

		const updatedRoles = [...account.roles, AccountRole.ADMIN];
		await this.accountRepository.updateAccountRoles(
			account.userId,
			updatedRoles,
		);
	}
}

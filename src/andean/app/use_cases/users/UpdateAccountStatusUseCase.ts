import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { UpdateAccountStatusDto } from '../../../infra/controllers/dto/UpdateAccountStatusDto';
import { Account } from '../../../domain/entities/Account';

@Injectable()
export class UpdateAccountStatusUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async handle(accountId: string, dto: UpdateAccountStatusDto): Promise<void> {
		const accountFound: Account | null =
			await this.accountRepository.getAccountById(accountId);
		if (!accountFound) {
			throw new NotFoundException();
		}
		return this.accountRepository.updateAccountStatus(accountId, dto.status);
	}
}

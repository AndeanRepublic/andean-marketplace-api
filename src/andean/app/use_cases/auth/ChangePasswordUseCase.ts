import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { HashService } from '../../../infra/services/HashService';
import { ChangePasswordDto } from '../../../infra/controllers/dto/ChangePasswordDto';

@Injectable()
export class ChangePasswordUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		private readonly hashService: HashService,
	) {}

	async execute(userId: string, dto: ChangePasswordDto): Promise<void> {
		const account = await this.accountRepository.getAccountById(userId);
		if (!account) {
			throw new UnauthorizedException('Account not found');
		}

		// Verify current password
		const isCurrentPasswordValid = await this.hashService.verify(
			account.password,
			dto.currentPassword,
		);
		if (!isCurrentPasswordValid) {
			throw new UnauthorizedException('Current password is incorrect');
		}

		// Check new password is different from current
		const isSamePassword = await this.hashService.verify(
			account.password,
			dto.newPassword,
		);
		if (isSamePassword) {
			throw new BadRequestException(
				'New password must be different from current password',
			);
		}

		// Hash new password
		const hashedPassword = await this.hashService.hash(dto.newPassword);

		// Update password (this will automatically increment passwordVersion via $inc)
		await this.accountRepository.updatePassword(userId, hashedPassword);
	}
}

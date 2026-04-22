import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from '../../datastore/Account.repo';
import { HashService } from '../../../infra/services/HashService';

interface ResetTokenPayload {
	sub: string;
	purpose: string;
}

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly hashService: HashService,
		private readonly jwtService: JwtService,
	) {}

	async execute(resetToken: string, newPassword: string): Promise<void> {
		let payload: ResetTokenPayload;

		try {
			payload = this.jwtService.verify<ResetTokenPayload>(resetToken);
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				throw new BadRequestException('Reset token expired');
			}
			throw new BadRequestException('Invalid reset token');
		}

		if (payload.purpose !== 'password-reset') {
			throw new BadRequestException('Invalid reset token');
		}

		const accountId = payload.sub;
		const hashedPassword = await this.hashService.hash(newPassword);
		await this.accountRepo.updatePassword(accountId, hashedPassword);
	}
}

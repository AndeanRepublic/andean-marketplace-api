import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetCodeRepository } from '../../datastore/PasswordResetCode.repo';

@Injectable()
export class VerifyResetCodeUseCase {
	constructor(
		@Inject(PasswordResetCodeRepository)
		private readonly codeRepo: PasswordResetCodeRepository,
		private readonly jwtService: JwtService,
	) {}

	async execute(email: string, code: string): Promise<{ resetToken: string }> {
		// Find active code for this email
		const activeCode = await this.codeRepo.findByEmailActive(email);

		if (!activeCode) {
			// Try to find any code to give better error
			const anyCode = await this.codeRepo.findByEmailAndCode(email, code);
			if (anyCode?.usedAt) {
				throw new BadRequestException('Code already used');
			}
			if (anyCode && new Date() > anyCode.expiresAt) {
				throw new BadRequestException('Code expired');
			}
			throw new BadRequestException('Invalid code');
		}

		// Check max attempts
		if (activeCode.attempts >= 3) {
			throw new BadRequestException(
				'Max attempts reached. Request a new code.',
			);
		}

		// Check if code matches
		if (activeCode.code !== code) {
			const newAttempts = await this.codeRepo.incrementAttempts(activeCode.id);
			if (newAttempts >= 3) {
				throw new BadRequestException(
					'Max attempts reached. Request a new code.',
				);
			}
			const remaining = 3 - newAttempts;
			throw new BadRequestException(
				`Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
			);
		}

		// Code is valid! Mark as used and generate resetToken
		await this.codeRepo.markAsUsed(email, code);

		const resetToken = this.jwtService.sign(
			{
				sub: activeCode.accountId,
				purpose: 'password-reset',
			},
			{ expiresIn: '5m' },
		);

		return { resetToken };
	}
}

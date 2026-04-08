import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../datastore/Account.repo';
import { PasswordResetCodeRepository } from '../../datastore/PasswordResetCode.repo';
import { EmailRepository } from '../../datastore/Email.repo';

@Injectable()
export class ForgotPasswordUseCase {
	constructor(
		@Inject(AccountRepository)
		private readonly accountRepo: AccountRepository,
		@Inject(PasswordResetCodeRepository)
		private readonly codeRepo: PasswordResetCodeRepository,
		@Inject(EmailRepository)
		private readonly emailRepo: EmailRepository,
	) {}

	async execute(email: string): Promise<void> {
		const account = await this.accountRepo.getAccountByEmail(email);
		if (!account) return; // Silent — no enumeration

		// Generate 6-digit code
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		// Expires in 5 minutes
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

		await this.codeRepo.create({
			code,
			email: account.email,
			accountId: account.id,
			expiresAt,
		});

		await this.emailRepo.sendPasswordReset({
			to: account.email,
			data: { code },
		});
	}
}

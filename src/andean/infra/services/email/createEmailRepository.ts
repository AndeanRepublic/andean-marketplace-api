import { ConfigService } from '@nestjs/config';
import { EmailRepository } from '../../../app/datastore/Email.repo';
import { ResendEmailRepoImpl } from '../../datastore/email.resend.impl';
import { SesEmailRepoImpl } from '../../datastore/email.repo.impl';
import { ResendClientService } from './ResendClientService';
import { SesClientService } from './SesClientService';

/**
 * Resolves the email provider from env. Uses Resend when EMAIL_PROVIDER=resend,
 * or when SES sender is missing but Resend is fully configured (common in local dev).
 */
export function createEmailRepository(
	configService: ConfigService,
	resendClient: ResendClientService,
	sesClient: SesClientService,
): EmailRepository {
	const explicit = (
		configService.get<string>('EMAIL_PROVIDER') || 'ses'
	).toLowerCase();
	const resendApiKey = configService.get<string>('RESEND_API_KEY');
	const sesSender = configService.get<string>('SES_SENDER_EMAIL')?.trim() || '';
	const resendSender =
		configService.get<string>('RESEND_SENDER_EMAIL')?.trim() ||
		sesSender;

	const useResend =
		explicit === 'resend' ||
		(explicit === 'ses' && !sesSender && !!resendApiKey && !!resendSender);

	if (useResend) {
		if (!resendApiKey) {
			throw new Error(
				'RESEND_API_KEY is required when EMAIL_PROVIDER=resend (or when using Resend fallback)',
			);
		}
		return new ResendEmailRepoImpl(resendClient);
	}

	if (explicit !== 'ses') {
		throw new Error(
			`Invalid EMAIL_PROVIDER: '${explicit}'. Valid values: 'resend' | 'ses'`,
		);
	}

	return new SesEmailRepoImpl(sesClient);
}

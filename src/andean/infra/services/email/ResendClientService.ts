import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendClientService {
	private readonly logger = new Logger(ResendClientService.name);
	private resendClient: Resend | null = null;
	private readonly senderEmail: string;
	private readonly senderName: string;

	constructor(private readonly configService: ConfigService) {
		this.senderEmail =
			this.configService.get<string>('RESEND_SENDER_EMAIL') ||
			this.configService.get<string>('SES_SENDER_EMAIL') ||
			'';
		this.senderName =
			this.configService.get<string>('RESEND_SENDER_NAME') ||
			this.configService.get<string>('SES_SENDER_NAME') ||
			'Andean Marketplace';

		if (!this.senderEmail) {
			this.logger.warn(
				'RESEND_SENDER_EMAIL is not configured. Email features will not work.',
			);
		}
	}

	getClient(): Resend {
		if (!this.resendClient) {
			const apiKey = this.configService.get<string>('RESEND_API_KEY');

			if (!apiKey) {
				throw new Error('RESEND_API_KEY is required');
			}

			this.resendClient = new Resend(apiKey);
		}
		return this.resendClient;
	}

	getSenderEmail(): string {
		return this.senderEmail;
	}

	getSenderName(): string {
		return this.senderName;
	}
}

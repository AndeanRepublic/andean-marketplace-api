import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient } from '@aws-sdk/client-ses';

@Injectable()
export class SesClientService {
	private readonly logger = new Logger(SesClientService.name);
	private sesClient: SESClient | null = null;
	private readonly senderEmail: string;
	private readonly senderName: string;
	private readonly region: string;

	constructor(private readonly configService: ConfigService) {
		this.senderEmail = this.configService.get<string>('SES_SENDER_EMAIL') || '';
		this.senderName =
			this.configService.get<string>('SES_SENDER_NAME') || 'Andean Marketplace';
		this.region =
			this.configService.get<string>('SES_REGION') ||
			this.configService.get<string>('AWS_REGION') ||
			'us-east-1';

		if (!this.senderEmail) {
			this.logger.warn(
				'SES_SENDER_EMAIL is not configured. Email features will not work.',
			);
		}
	}

	getClient(): SESClient {
		if (!this.sesClient) {
			this.sesClient = new SESClient({
				region: this.region,
				credentials: {
					accessKeyId:
						this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
					secretAccessKey:
						this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
				},
			});
		}
		return this.sesClient;
	}

	getSenderEmail(): string {
		return this.senderEmail;
	}

	getSenderName(): string {
		return this.senderName;
	}
}

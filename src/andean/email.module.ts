import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailRepository } from './app/datastore/Email.repo';
import { SesClientService } from './infra/services/email/SesClientService';
import { ResendClientService } from './infra/services/email/ResendClientService';
import { createEmailRepository } from './infra/services/email/createEmailRepository';

@Module({
	imports: [ConfigModule],
	providers: [
		SesClientService,
		ResendClientService,
		{
			provide: EmailRepository,
			useFactory: createEmailRepository,
			inject: [ConfigService, ResendClientService, SesClientService],
		},
	],
	exports: [EmailRepository, SesClientService, ResendClientService],
})
export class EmailModule {}

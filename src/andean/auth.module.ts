import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './infra/controllers/auth.controller';
import { LoginUseCase } from './app/use_cases/auth/LoginUseCase';
import { AssignAdminUseCase } from './app/use_cases/auth/AssignAdminUseCase';
import { ForgotPasswordUseCase } from './app/use_cases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from './app/use_cases/auth/ResetPasswordUseCase';
import { VerifyResetCodeUseCase } from './app/use_cases/auth/VerifyResetCodeUseCase';
import { UsersModule } from './users.module';
import { MediaItemModule } from './mediaItem.module';
import { HashService } from './infra/services/HashService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './infra/core/jwtAuth.guard';
import { PasswordResetCodeSchema } from './infra/persistence/passwordResetCode.schema';
import { PasswordResetCodeRepository } from './app/datastore/PasswordResetCode.repo';
import { PasswordResetCodeRepoImpl } from './infra/datastore/passwordResetCode.repo.impl';
import { EmailRepository } from './app/datastore/Email.repo';
import { SesEmailRepoImpl } from './infra/datastore/email.repo.impl';
import { SesClientService } from './infra/services/email/SesClientService';
import { ResendClientService } from './infra/services/email/ResendClientService';
import { ResendEmailRepoImpl } from './infra/datastore/email.resend.impl';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],

			useFactory: (configService: ConfigService) => {
				const secret =
					configService.get<string>('JWT_SECRET') ||
					'default-secret-change-in-production';
				const expiresIn =
					configService.get<string>('JWT_EXPIRES_IN') ?? '3600s';
				return {
					secret,
					signOptions: {
						issuer: configService.get<string>('JWT_ISSUER') ?? 'local-andeanMP',
						expiresIn: expiresIn as any,
					},
				};
			},
		}),
		MongooseModule.forFeature([
			{ name: 'PasswordResetCode', schema: PasswordResetCodeSchema },
		]),
		UsersModule,
		MediaItemModule,
	],
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		AssignAdminUseCase,
		ForgotPasswordUseCase,
		ResetPasswordUseCase,
		VerifyResetCodeUseCase,
		HashService,
		SesClientService,
		ResendClientService,
		{
			provide: PasswordResetCodeRepository,
			useClass: PasswordResetCodeRepoImpl,
		},
		{
			provide: EmailRepository,
			useFactory: (
				configService: ConfigService,
				resendClient: ResendClientService,
				sesClient: SesClientService,
			): EmailRepository => {
				const provider = configService.get<string>('EMAIL_PROVIDER') || 'ses';
				if (provider === 'resend') {
					const apiKey = configService.get<string>('RESEND_API_KEY');
					if (!apiKey) {
						throw new Error(
							'RESEND_API_KEY is required when EMAIL_PROVIDER=resend',
						);
					}
					return new ResendEmailRepoImpl(resendClient);
				}
				if (provider !== 'ses') {
					throw new Error(
						`Invalid EMAIL_PROVIDER: '${provider}'. Valid values: 'resend' | 'ses'`,
					);
				}
				return new SesEmailRepoImpl(sesClient);
			},
			inject: [ConfigService, ResendClientService, SesClientService],
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
	exports: [JwtModule],
})
export class AuthModule {}

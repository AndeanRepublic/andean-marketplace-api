import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './infra/controllers/auth.controller';
import { LoginUseCase } from './app/use_cases/auth/LoginUseCase';
import { AssignAdminUseCase } from './app/use_cases/auth/AssignAdminUseCase';
import { UsersModule } from './users.module';
import { MediaItemModule } from './mediaItem.module';
import { HashService } from './infra/services/HashService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './infra/core/jwtAuth.guard';

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
		UsersModule,
		MediaItemModule,
	],
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		AssignAdminUseCase,
		HashService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
	exports: [JwtModule],
})
export class AuthModule {}

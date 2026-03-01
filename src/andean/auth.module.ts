import { Module } from '@nestjs/common';
import { AuthController } from './infra/controllers/auth.controller';
import { LoginUseCase } from './app/use_cases/auth/LoginUseCase';
import { UsersModule } from './users.module';
import { HashService } from './infra/services/HashService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './infra/core/jwtAuth.guard';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
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
	],
	controllers: [AuthController],
	providers: [LoginUseCase, HashService, JwtAuthGuard],
	exports: [JwtAuthGuard, JwtModule], // Export both the guard and JwtModule
})
export class AuthModule {}

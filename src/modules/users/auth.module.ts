import { Module } from '@nestjs/common';
import { AuthController } from './infra/controllers/auth.controller';
import { LoginUseCase } from './app/use_cases/LoginUseCase';
import { UsersModule } from './users.module';
import { HashService } from './infra/services/HashService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          issuer: configService.get<string>('JWT_ISSUER') ?? 'local-andeanMP',
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') ?? '3600s',
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, HashService],
})
export class AuthModule {}

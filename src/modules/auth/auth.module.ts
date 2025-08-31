import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './infra/persistence/account.schema';
import { AuthController } from './infra/controllers/auth.controller';
import { LoginUseCase } from './app/use_cases/LoginUseCase';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountRepoImpl } from './infra/datastore/Account.repo.impl';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Account',
        schema: AccountSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: AccountRepository,
      useClass: AccountRepoImpl,
    },
  ],
  exports: [AccountRepository],
})
export class AuthModule {}

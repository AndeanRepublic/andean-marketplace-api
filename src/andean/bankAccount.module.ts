import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccountSchema } from './infra/persistence/bankAccount.schema';
import { BankAccountController } from './infra/controllers/bankAccount.controller';
import { CreateBankAccountUseCase } from './app/use_cases/bank_accounts/CreateBankAccountUseCase';
import { GetBankAccountsBySellerUseCase } from './app/use_cases/bank_accounts/GetBankAccountsBySellerUseCase';
import { GetBankAccountByIdUseCase } from './app/use_cases/bank_accounts/GetBankAccountByIdUseCase';
import { DeleteBankAccountUseCase } from './app/use_cases/bank_accounts/DeleteBankAccountUseCase';
import { SellerBankAccountRepository } from './app/datastore/SellerBankAccount.repo';
import { SellerBankAccountRepoImpl } from './infra/datastore/sellerBankAccount.repo.impl';
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'BankAccount',
        schema: BankAccountSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [BankAccountController],
  providers: [
    CreateBankAccountUseCase,
    GetBankAccountsBySellerUseCase,
    GetBankAccountByIdUseCase,
    DeleteBankAccountUseCase,
    {
      provide: SellerBankAccountRepository,
      useClass: SellerBankAccountRepoImpl,
    },
    {
      provide: SellerProfileRepository,
      useClass: SellerProfileRepositoryImpl,
    },
  ],
  exports: [SellerBankAccountRepository],
})
export class BankAccountsModule {}

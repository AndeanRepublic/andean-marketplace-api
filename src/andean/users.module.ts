import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infra/persistence/user.schema';
import { UserController } from './infra/controllers/user.controller';
import { CreateCustomerUseCase } from './app/use_cases/users/CreateCustomerUseCase';
import { CustomerProfileRepositoryImpl } from './infra/datastore/user.repo.impl';
import { CustomerProfileRepository } from './app/datastore/Customer.repo';
import { GetAllCustomerUseCase } from './app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from './app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from './app/use_cases/users/CreateSellerUseCase';
import { SellerSchema } from './infra/persistence/seller.schema';
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { AccountSchema } from './infra/persistence/account.schema';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountRepoImpl } from './infra/datastore/account.repo.impl';
import { HashService } from './infra/services/HashService';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CustomerProfile',
        schema: UserSchema,
      },
      {
        name: 'Seller',
        schema: SellerSchema,
      },
      {
        name: 'Account',
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    CreateCustomerUseCase,
    GetAllCustomerUseCase,
    GetAllSellersUseCase,
    CreateSellerUseCase,
    HashService,
    {
      provide: CustomerProfileRepository,
      useClass: CustomerProfileRepositoryImpl,
    },
    {
      provide: SellerProfileRepository,
      useClass: SellerProfileRepositoryImpl,
    },
    {
      provide: AccountRepository,
      useClass: AccountRepoImpl,
    },
  ],
  exports: [
    CustomerProfileRepository,
    SellerProfileRepository,
    AccountRepository,
    MongooseModule,
  ],
})
export class UsersModule {}

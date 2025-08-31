import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infra/persistence/user.schema';
import { UserController } from './infra/controllers/user.controller';
import { CreateUserUseCase } from './app/use_cases/CreateUserUseCase';
import { UserRepositoryImpl } from './infra/datastore/user.repo.impl';
import { UserRepository } from './app/datastore/User.repo';
import { GetAllUsersUseCase } from './app/use_cases/GetAllUsersUseCase';
import { GetAllSellersUseCase } from './app/use_cases/GetAllSellersUseCase';
import { CreateSellerUseCase } from './app/use_cases/CreateSellerUseCase';
import { SellerSchema } from './infra/persistence/seller.schema';
import { SellerRepository } from './app/datastore/Seller.repo';
import { SellerRepositoryImpl } from './infra/datastore/seller.repo.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Seller',
        schema: SellerSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetAllSellersUseCase,
    CreateSellerUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: SellerRepository,
      useClass: SellerRepositoryImpl,
    },
  ],
  exports: [UserRepository, SellerRepository],
})
export class UsersModule {}

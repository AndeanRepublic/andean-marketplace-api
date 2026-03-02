import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infra/persistence/user.schema';
import { UserController } from './infra/controllers/user.controller';
import { CreateUserUseCase } from './app/use_cases/CreateUserUseCase';
import { UserRepositoryImpl } from './infra/datastore/user.repo.impl';
import { UserRepository } from './app/datastore/User.repo';
import { GetAllUsersUseCase } from './app/use_cases/GetAllUsersUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}

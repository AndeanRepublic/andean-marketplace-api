import { Module } from '@nestjs/common';
import { AdminController } from './infra/controllers/admin.controller';
import { UpdateAccountStatusUseCase } from './app/use_cases/users/UpdateAccountStatusUseCase';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountRepoImpl } from './infra/datastore/account.repo.impl';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './infra/persistence/account.schema';
import { HashService } from './infra/services/HashService';
import { GetAllCustomerUseCase } from './app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from './app/use_cases/users/GetAllSellersUseCase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Account',
				schema: AccountSchema,
			},
		]),
		UsersModule,
		AuthModule, // Import AuthModule to access JwtAuthGuard and JwtService
	],
	controllers: [AdminController],
	providers: [
		HashService,
		UpdateAccountStatusUseCase,
		GetAllCustomerUseCase,
		GetAllSellersUseCase,
		{
			provide: AccountRepository,
			useClass: AccountRepoImpl,
		},
	],
	exports: [MongooseModule],
})
export class AdminModule { }

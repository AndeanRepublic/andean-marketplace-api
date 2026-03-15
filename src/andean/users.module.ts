import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerProfileSchema } from './infra/persistence/customerProfileSchema';
import { UserController } from './infra/controllers/user.controller';
import { CreateCustomerUseCase } from './app/use_cases/users/CreateCustomerUseCase';
import { CustomerProfileRepositoryImpl } from './infra/datastore/customer.repo.impl';
import { CustomerProfileRepository } from './app/datastore/Customer.repo';
import { GetAllCustomerUseCase } from './app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from './app/use_cases/users/GetAllSellersUseCase';
import { CreateSellerUseCase } from './app/use_cases/users/CreateSellerUseCase';
import { SellerProfileSchema } from './infra/persistence/sellerProfileSchema';
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { AccountSchema } from './infra/persistence/account.schema';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountRepoImpl } from './infra/datastore/account.repo.impl';
import { HashService } from './infra/services/HashService';
import { UpdateCustomerProfileUseCase } from './app/use_cases/users/UpdateCustomerProfileUseCase';
import { UpdateSellerProfileUseCase } from './app/use_cases/users/UpdateSellerProfileUseCase';
import { GetCustomerProfileUseCase } from './app/use_cases/users/GetCustomerProfileUseCase';
import { GetSellerProfileUseCase } from './app/use_cases/users/GetSellerProfileUseCase';
import { MediaItemModule } from './mediaItem.module';
import { AuthModule } from './auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'CustomerProfile',
				schema: CustomerProfileSchema,
			},
			{
				name: 'SellerProfile',
				schema: SellerProfileSchema,
			},
			{
				name: 'Account',
				schema: AccountSchema,
			},
		]),
		MediaItemModule,
		AuthModule,
	],
	controllers: [UserController],
	providers: [
		CreateCustomerUseCase,
		GetAllCustomerUseCase,
		GetAllSellersUseCase,
		CreateSellerUseCase,
		UpdateCustomerProfileUseCase,
		UpdateSellerProfileUseCase,
		GetCustomerProfileUseCase,
		GetSellerProfileUseCase,
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

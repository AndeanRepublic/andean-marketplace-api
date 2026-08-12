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
import { UpdateCustomerProfileUseCase } from './app/use_cases/users/UpdateCustomerProfileUseCase';
import { UpdateSellerProfileUseCase } from './app/use_cases/users/UpdateSellerProfileUseCase';
import { GetCustomerProfileUseCase } from './app/use_cases/users/GetCustomerProfileUseCase';
import { GetSellerProfileUseCase } from './app/use_cases/users/GetSellerProfileUseCase';
import { CreateAdminSellerUseCase } from './app/use_cases/users/CreateAdminSellerUseCase';
import { LookupAccountByEmailUseCase } from './app/use_cases/users/LookupAccountByEmailUseCase';
import { CreateAdminSellerByEmailUseCase } from './app/use_cases/users/CreateAdminSellerByEmailUseCase';
import { CreateAdminSellerWithAccountUseCase } from './app/use_cases/users/CreateAdminSellerWithAccountUseCase';
import { MediaItemModule } from './mediaItem.module';

/**
 * AccountRepository / HashService come from global SharedModule.
 * Keep admin-seller application use cases exported for AdminModule.
 */
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
		]),
		MediaItemModule,
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
		CreateAdminSellerUseCase,
		LookupAccountByEmailUseCase,
		CreateAdminSellerByEmailUseCase,
		CreateAdminSellerWithAccountUseCase,
		{
			provide: CustomerProfileRepository,
			useClass: CustomerProfileRepositoryImpl,
		},
		{
			provide: SellerProfileRepository,
			useClass: SellerProfileRepositoryImpl,
		},
	],
	exports: [
		CustomerProfileRepository,
		SellerProfileRepository,
		CreateSellerUseCase,
		CreateAdminSellerUseCase,
		LookupAccountByEmailUseCase,
		CreateAdminSellerByEmailUseCase,
		CreateAdminSellerWithAccountUseCase,
		MongooseModule,
	],
})
export class UsersModule {}

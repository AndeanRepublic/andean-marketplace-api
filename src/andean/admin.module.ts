import { Module } from '@nestjs/common';

import { AdminController } from './infra/controllers/admin.controller';

import { UpdateAccountStatusUseCase } from './app/use_cases/users/UpdateAccountStatusUseCase';

import { ReviewSellerApplicationUseCase } from './app/use_cases/users/ReviewSellerApplicationUseCase';

import { ListPendingSellerApplicationsUseCase } from './app/use_cases/users/ListPendingSellerApplicationsUseCase';

import { GetSellerApplicationDetailUseCase } from './app/use_cases/users/GetSellerApplicationDetailUseCase';

import { SendSellerApplicationReviewEmailUseCase } from './app/use_cases/email/SendSellerApplicationReviewEmailUseCase';

import { AccountRepository } from './app/datastore/Account.repo';

import { AccountRepoImpl } from './infra/datastore/account.repo.impl';

import { UsersModule } from './users.module';

import { ShopsModule } from './shop.module';

import { MediaItemModule } from './mediaItem.module';

import { ProviderInfoModule } from './providerInfo.module';

import { CommunityModule } from './community.module';

import { EmailModule } from './email.module';

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
		ShopsModule,
		MediaItemModule,
		ProviderInfoModule,
		CommunityModule,
		EmailModule,
	],
	controllers: [AdminController],
	providers: [
		HashService,
		UpdateAccountStatusUseCase,
		ReviewSellerApplicationUseCase,
		ListPendingSellerApplicationsUseCase,
		GetSellerApplicationDetailUseCase,
		SendSellerApplicationReviewEmailUseCase,
		GetAllCustomerUseCase,
		GetAllSellersUseCase,
		{
			provide: AccountRepository,
			useClass: AccountRepoImpl,
		},
	],
	exports: [MongooseModule],
})
export class AdminModule {}

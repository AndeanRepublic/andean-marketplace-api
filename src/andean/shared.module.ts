import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './infra/persistence/account.schema';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountRepoImpl } from './infra/datastore/account.repo.impl';
import { HashService } from './infra/services/HashService';

/**
 * SharedModule provides globally available repositories and services
 * that need to be injected across multiple modules without creating
 * circular dependencies.
 * 
 * @Global decorator makes this module's exports available everywhere
 * without needing to import it in each module.
 */
@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Account',
				schema: AccountSchema,
			},
		]),
	],
	providers: [
		HashService,
		{
			provide: AccountRepository,
			useClass: AccountRepoImpl,
		},
	],
	exports: [AccountRepository, HashService, MongooseModule],
})
export class SharedModule {}

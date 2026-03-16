import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderInfoSchema } from './infra/persistence/providerInfo.schema';
import { ProviderInfoRepository } from './app/datastore/ProviderInfo.repo';
import { ProviderInfoRepoImpl } from './infra/datastore/providerInfo.repo.impl';
import { CreateProviderInfoUseCase } from './app/use_cases/providerInfo/CreateProviderInfoUseCase';
import { UpdateProviderInfoUseCase } from './app/use_cases/providerInfo/UpdateProviderInfoUseCase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'ProviderInfo', schema: ProviderInfoSchema },
		]),
	],
	providers: [
		{
			provide: ProviderInfoRepository,
			useClass: ProviderInfoRepoImpl,
		},
		CreateProviderInfoUseCase,
		UpdateProviderInfoUseCase,
	],
	exports: [
		ProviderInfoRepository,
		CreateProviderInfoUseCase,
		UpdateProviderInfoUseCase,
		MongooseModule,
	],
})
export class ProviderInfoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';

// Schemas
import { OriginProductRegionSchema } from './infra/persistence/originProductRegion.schema';
import { OriginProductCommunitySchema } from './infra/persistence/originProductCommunity.schema';

// Repositories
import { OriginProductRegionRepository } from './app/datastore/originProductRegion.repo';
import { OriginProductRegionRepositoryImpl } from './infra/datastore/originProductRegion.repo.impl';
import { OriginProductCommunityRepository } from './app/datastore/originProductCommunity.repo';
import { OriginProductCommunityRepositoryImpl } from './infra/datastore/originProductCommunity.repo.impl';

// Region Use Cases
import { CreateOriginProductRegionUseCase } from './app/use_cases/origin/CreateOriginProductRegionUseCase';
import { CreateManyOriginProductRegionsUseCase } from './app/use_cases/origin/CreateManyOriginProductRegionsUseCase';
import { UpdateOriginProductRegionUseCase } from './app/use_cases/origin/UpdateOriginProductRegionUseCase';
import { GetOriginProductRegionByIdUseCase } from './app/use_cases/origin/GetOriginProductRegionByIdUseCase';
import { ListOriginProductRegionUseCase } from './app/use_cases/origin/ListOriginProductRegionUseCase';
import { DeleteOriginProductRegionUseCase } from './app/use_cases/origin/DeleteOriginProductRegionUseCase';

// Community Use Cases
import { CreateOriginProductCommunityUseCase } from './app/use_cases/origin/CreateOriginProductCommunityUseCase';
import { CreateManyOriginProductCommunitiesUseCase } from './app/use_cases/origin/CreateManyOriginProductCommunitiesUseCase';
import { UpdateOriginProductCommunityUseCase } from './app/use_cases/origin/UpdateOriginProductCommunityUseCase';
import { GetOriginProductCommunityByIdUseCase } from './app/use_cases/origin/GetOriginProductCommunityByIdUseCase';
import { ListOriginProductCommunityUseCase } from './app/use_cases/origin/ListOriginProductCommunityUseCase';
import { DeleteOriginProductCommunityUseCase } from './app/use_cases/origin/DeleteOriginProductCommunityUseCase';

// Controllers
import { OriginProductRegionController } from './infra/controllers/originProductRegion.controller';
import { OriginProductCommunityController } from './infra/controllers/originProductCommunity.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'OriginProductRegion', schema: OriginProductRegionSchema },
			{ name: 'OriginProductCommunity', schema: OriginProductCommunitySchema },
		]),
		AuthModule,
	],
	controllers: [
		OriginProductRegionController,
		OriginProductCommunityController,
	],
	providers: [
		// Region Repository
		{
			provide: OriginProductRegionRepository,
			useClass: OriginProductRegionRepositoryImpl,
		},
		// Community Repository
		{
			provide: OriginProductCommunityRepository,
			useClass: OriginProductCommunityRepositoryImpl,
		},

		// Region Use Cases
		CreateOriginProductRegionUseCase,
		CreateManyOriginProductRegionsUseCase,
		UpdateOriginProductRegionUseCase,
		GetOriginProductRegionByIdUseCase,
		ListOriginProductRegionUseCase,
		DeleteOriginProductRegionUseCase,

		// Community Use Cases
		CreateOriginProductCommunityUseCase,
		CreateManyOriginProductCommunitiesUseCase,
		UpdateOriginProductCommunityUseCase,
		GetOriginProductCommunityByIdUseCase,
		ListOriginProductCommunityUseCase,
		DeleteOriginProductCommunityUseCase,
	],
	exports: [OriginProductRegionRepository, OriginProductCommunityRepository],
})
export class OriginProductModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { CommunitySchema } from './infra/persistence/community.schema';

// Repository
import { CommunityRepository } from './app/datastore/community.repo';
import { CommunityRepositoryImpl } from './infra/datastore/community.repo.impl';

// Use Cases
import { CreateCommunityUseCase } from './app/use_cases/community/CreateCommunityUseCase';
import { UpdateCommunityUseCase } from './app/use_cases/community/UpdateCommunityUseCase';
import { GetCommunityByIdUseCase } from './app/use_cases/community/GetCommunityByIdUseCase';
import { ListCommunityUseCase } from './app/use_cases/community/ListCommunityUseCase';
import { DeleteCommunityUseCase } from './app/use_cases/community/DeleteCommunityUseCase';

// Controller
import { CommunityController } from './infra/controllers/community.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Community', schema: CommunitySchema },
		]),
	],
	controllers: [CommunityController],
	providers: [
		// Repository
		{
			provide: CommunityRepository,
			useClass: CommunityRepositoryImpl,
		},

		// Use Cases
		CreateCommunityUseCase,
		UpdateCommunityUseCase,
		GetCommunityByIdUseCase,
		ListCommunityUseCase,
		DeleteCommunityUseCase,
	],
	exports: [CommunityRepository],
})
export class CommunityModule { }

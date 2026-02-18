import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { ExperienceBasicInfoSchema } from './infra/persistence/experiences/experienceBasicInfo.schema';
import { ExperienceMediaInfoSchema } from './infra/persistence/experiences/experienceMediaInfo.schema';
import { ExperienceDetailInfoSchema } from './infra/persistence/experiences/experienceDetailInfo.schema';
import { ExperiencePricesSchema } from './infra/persistence/experiences/experiencePrices.schema';
import { ExperienceAvailabilitySchema } from './infra/persistence/experiences/experienceAvailability.schema';
import { ExperienceItinerarySchema } from './infra/persistence/experiences/experienceItinerary.schema';
import { ExperienceSchema } from './infra/persistence/experiences/experience.schema';

// Abstract Repositories
import { ExperienceBasicInfoRepository } from './app/datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceMediaInfoRepository } from './app/datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceDetailInfoRepository } from './app/datastore/experiences/ExperienceDetailInfo.repo';
import { ExperiencePricesRepository } from './app/datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from './app/datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from './app/datastore/experiences/ExperienceItinerary.repo';
import { ExperienceRepository } from './app/datastore/experiences/Experience.repo';

// Repository Implementations
import { ExperienceBasicInfoRepositoryImpl } from './infra/datastore/experiences/experienceBasicInfo.repo.impl';
import { ExperienceMediaInfoRepositoryImpl } from './infra/datastore/experiences/experienceMediaInfo.repo.impl';
import { ExperienceDetailInfoRepositoryImpl } from './infra/datastore/experiences/experienceDetailInfo.repo.impl';
import { ExperiencePricesRepositoryImpl } from './infra/datastore/experiences/experiencePrices.repo.impl';
import { ExperienceAvailabilityRepositoryImpl } from './infra/datastore/experiences/experienceAvailability.repo.impl';
import { ExperienceItineraryRepositoryImpl } from './infra/datastore/experiences/experienceItinerary.repo.impl';
import { ExperienceRepositoryImpl } from './infra/datastore/experiences/experience.repo.impl';

// Sub-table Use Cases
import { CreateExperienceBasicInfoUseCase } from './app/use_cases/experiences/basicInfo/CreateExperienceBasicInfoUseCase';
import { CreateExperienceMediaInfoUseCase } from './app/use_cases/experiences/mediaInfo/CreateExperienceMediaInfoUseCase';
import { CreateExperienceDetailInfoUseCase } from './app/use_cases/experiences/detailInfo/CreateExperienceDetailInfoUseCase';
import { CreateExperiencePricesUseCase } from './app/use_cases/experiences/prices/CreateExperiencePricesUseCase';
import { CreateExperienceAvailabilityUseCase } from './app/use_cases/experiences/availability/CreateExperienceAvailabilityUseCase';
import { CreateExperienceItineraryUseCase } from './app/use_cases/experiences/itinerary/CreateExperienceItineraryUseCase';
import { UpdateExperienceBasicInfoUseCase } from './app/use_cases/experiences/basicInfo/UpdateExperienceBasicInfoUseCase';
import { UpdateExperienceMediaInfoUseCase } from './app/use_cases/experiences/mediaInfo/UpdateExperienceMediaInfoUseCase';
import { UpdateExperienceDetailInfoUseCase } from './app/use_cases/experiences/detailInfo/UpdateExperienceDetailInfoUseCase';
import { UpdateExperiencePricesUseCase } from './app/use_cases/experiences/prices/UpdateExperiencePricesUseCase';
import { UpdateExperienceAvailabilityUseCase } from './app/use_cases/experiences/availability/UpdateExperienceAvailabilityUseCase';
import { UpdateExperienceItineraryUseCase } from './app/use_cases/experiences/itinerary/UpdateExperienceItineraryUseCase';

// Main Use Cases
import { CreateExperienceUseCase } from './app/use_cases/experiences/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from './app/use_cases/experiences/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from './app/use_cases/experiences/DeleteExperienceUseCase';
import { GetAllExperiencesUseCase } from './app/use_cases/experiences/GetAllExperiencesUseCase';
import { GetByIdExperienceUseCase } from './app/use_cases/experiences/GetByIdExperienceUseCase';

// Strategy
import { OwnerStrategyResolver } from './infra/services/experiences/OwnerStrategyResolver';

// Controller
import { ExperienceController } from './infra/controllers/experienceControllers/experience.controller';

// External Modules
import { CommunityModule } from './community.module';
import { MediaItemModule } from './mediaItem.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'ExperienceBasicInfo', schema: ExperienceBasicInfoSchema },
			{ name: 'ExperienceMediaInfo', schema: ExperienceMediaInfoSchema },
			{ name: 'ExperienceDetailInfo', schema: ExperienceDetailInfoSchema },
			{ name: 'ExperiencePrices', schema: ExperiencePricesSchema },
			{
				name: 'ExperienceAvailability',
				schema: ExperienceAvailabilitySchema,
			},
			{ name: 'ExperienceItinerary', schema: ExperienceItinerarySchema },
			{ name: 'Experience', schema: ExperienceSchema },
		]),
		CommunityModule,
		MediaItemModule,
	],
	controllers: [ExperienceController],
	providers: [
		// Repository bindings
		{
			provide: ExperienceBasicInfoRepository,
			useClass: ExperienceBasicInfoRepositoryImpl,
		},
		{
			provide: ExperienceMediaInfoRepository,
			useClass: ExperienceMediaInfoRepositoryImpl,
		},
		{
			provide: ExperienceDetailInfoRepository,
			useClass: ExperienceDetailInfoRepositoryImpl,
		},
		{
			provide: ExperiencePricesRepository,
			useClass: ExperiencePricesRepositoryImpl,
		},
		{
			provide: ExperienceAvailabilityRepository,
			useClass: ExperienceAvailabilityRepositoryImpl,
		},
		{
			provide: ExperienceItineraryRepository,
			useClass: ExperienceItineraryRepositoryImpl,
		},
		{
			provide: ExperienceRepository,
			useClass: ExperienceRepositoryImpl,
		},

		// Strategy
		OwnerStrategyResolver,

		// Sub-table Use Cases
		CreateExperienceBasicInfoUseCase,
		CreateExperienceMediaInfoUseCase,
		CreateExperienceDetailInfoUseCase,
		CreateExperiencePricesUseCase,
		CreateExperienceAvailabilityUseCase,
		CreateExperienceItineraryUseCase,
		UpdateExperienceBasicInfoUseCase,
		UpdateExperienceMediaInfoUseCase,
		UpdateExperienceDetailInfoUseCase,
		UpdateExperiencePricesUseCase,
		UpdateExperienceAvailabilityUseCase,
		UpdateExperienceItineraryUseCase,

		// Main Use Cases
		CreateExperienceUseCase,
		UpdateExperienceUseCase,
		DeleteExperienceUseCase,
		GetAllExperiencesUseCase,
		GetByIdExperienceUseCase,
	],
	exports: [
		ExperienceBasicInfoRepository,
		ExperienceMediaInfoRepository,
		ExperienceDetailInfoRepository,
		ExperiencePricesRepository,
		ExperienceAvailabilityRepository,
		ExperienceItineraryRepository,
		ExperienceRepository,
	],
})
export class ExperienceModule { }

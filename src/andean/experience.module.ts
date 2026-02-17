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
	],
	controllers: [],
	providers: [
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

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { ExperiencePricesSchema } from './infra/persistence/experiences/experiencePrices.schema';
import { ExperienceAvailabilitySchema } from './infra/persistence/experiences/experienceAvailability.schema';
import { ExperienceItinerarySchema } from './infra/persistence/experiences/experienceItinerary.schema';
import { ExperienceSchema } from './infra/persistence/experiences/experience.schema';
import { ExperienceCategorySchema } from './infra/persistence/experiences/experienceCategory.schema';
import { ReviewSchema } from './infra/persistence/Review.schema';

// Abstract Repositories
import { ExperiencePricesRepository } from './app/datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from './app/datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from './app/datastore/experiences/ExperienceItinerary.repo';
import { ExperienceRepository } from './app/datastore/experiences/Experience.repo';
import { ExperienceCategoryRepository } from './app/datastore/experiences/ExperienceCategory.repo';
import { ReviewRepository } from './app/datastore/Review.repo';

// Repository Implementations
import { ExperiencePricesRepositoryImpl } from './infra/datastore/experiences/experiencePrices.repo.impl';
import { ExperienceAvailabilityRepositoryImpl } from './infra/datastore/experiences/experienceAvailability.repo.impl';
import { ExperienceItineraryRepositoryImpl } from './infra/datastore/experiences/experienceItinerary.repo.impl';
import { ExperienceRepositoryImpl } from './infra/datastore/experiences/experience.repo.impl';
import { ExperienceCategoryRepositoryImpl } from './infra/datastore/experiences/experienceCategory.repo.impl';
import { ReviewRepositoryImpl } from './infra/datastore/Review.repo.impl';

// Sub-table Use Cases (solo prices, availability e itinerary siguen siendo colecciones separadas)
import { CreateExperiencePricesUseCase } from './app/use_cases/experiences/prices/CreateExperiencePricesUseCase';
import { CreateExperienceAvailabilityUseCase } from './app/use_cases/experiences/availability/CreateExperienceAvailabilityUseCase';
import { CreateExperienceItineraryUseCase } from './app/use_cases/experiences/itinerary/CreateExperienceItineraryUseCase';
import { UpdateExperiencePricesUseCase } from './app/use_cases/experiences/prices/UpdateExperiencePricesUseCase';
import { UpdateExperienceAvailabilityUseCase } from './app/use_cases/experiences/availability/UpdateExperienceAvailabilityUseCase';
import { UpdateExperienceItineraryUseCase } from './app/use_cases/experiences/itinerary/UpdateExperienceItineraryUseCase';
import { UpdatePriceByAgeGroupUseCase } from './app/use_cases/experiences/prices/UpdatePriceByAgeGroupUseCase';
import { UpdateExcludedDatesUseCase } from './app/use_cases/experiences/availability/UpdateExcludedDatesUseCase';
import { UpdateAvailableDatesUseCase } from './app/use_cases/experiences/availability/UpdateAvailableDatesUseCase';
import { GetSharedCapacityByDateRangeUseCase } from './app/use_cases/experiences/availability/GetSharedCapacityByDateRangeUseCase';

// Main Use Cases
import { CreateExperienceUseCase } from './app/use_cases/experiences/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from './app/use_cases/experiences/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from './app/use_cases/experiences/DeleteExperienceUseCase';
import { GetAllExperiencesUseCase } from './app/use_cases/experiences/GetAllExperiencesUseCase';
import { GetAllExperiencesForManagementUseCase } from './app/use_cases/experiences/GetAllExperiencesForManagementUseCase';
import { GetByIdExperienceUseCase } from './app/use_cases/experiences/GetByIdExperienceUseCase';
import { GetAvailabilityModeByIdUseCase } from './app/use_cases/experiences/GetAvailabilityModeByIdUseCase';
import { GetFutureUnavailableDatesUseCase } from './app/use_cases/experiences/GetFutureUnavailableDatesUseCase';
import { UpdateExperienceStatusUseCase } from './app/use_cases/experiences/UpdateExperienceStatusUseCase';

// Strategy
import { OwnerStrategyResolver } from './infra/services/experiences/OwnerStrategyResolver';
import { OwnerInfoResolver } from './infra/services/owner/OwnerInfoResolver';

// Controllers
import { ExperienceCategoryController } from './infra/controllers/experienceControllers/experienceCategory.controller';
import { ExperienceController } from './infra/controllers/experienceControllers/experience.controller';
import { ExperiencePricesController } from './infra/controllers/experienceControllers/experience-prices.controller';
import { ExperienceAvailabilityController } from './infra/controllers/experienceControllers/experience-availability.controller';

// External Modules
import { CommunityModule } from './community.module';
import { MediaItemModule } from './mediaItem.module';
import { UsersModule } from './users.module';
import { ShopsModule } from './shop.module';
import { BookingModule } from './booking.module';
import { SellerResourceAccessModule } from './sellerResourceAccess.module';
import { GetExperienceForEditUseCase } from './app/use_cases/experiences/GetExperienceForEditUseCase';
import { CreateExperienceCategoryUseCase } from './app/use_cases/experiences/category/CreateExperienceCategoryUseCase';
import { CreateManyExperienceCategoriesUseCase } from './app/use_cases/experiences/category/CreateManyExperienceCategoriesUseCase';
import { ListExperienceCategoriesUseCase } from './app/use_cases/experiences/category/ListExperienceCategoriesUseCase';
import { GetExperienceCategoryByIdUseCase } from './app/use_cases/experiences/category/GetExperienceCategoryByIdUseCase';
import { UpdateExperienceCategoryUseCase } from './app/use_cases/experiences/category/UpdateExperienceCategoryUseCase';
import { DeleteExperienceCategoryUseCase } from './app/use_cases/experiences/category/DeleteExperienceCategoryUseCase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'ExperiencePrices', schema: ExperiencePricesSchema },
			{ name: 'ExperienceAvailability', schema: ExperienceAvailabilitySchema },
			{ name: 'ExperienceItinerary', schema: ExperienceItinerarySchema },
			{ name: 'Experience', schema: ExperienceSchema },
			{ name: 'ExperienceCategory', schema: ExperienceCategorySchema },
			{ name: 'Review', schema: ReviewSchema },
		]),
		CommunityModule,
		MediaItemModule,
		UsersModule,
		ShopsModule,
		forwardRef(() => BookingModule),
		SellerResourceAccessModule,
	],
	controllers: [
		ExperienceCategoryController,
		ExperienceController,
		ExperiencePricesController,
		ExperienceAvailabilityController,
	],
	providers: [
		// Repository bindings
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
		{
			provide: ExperienceCategoryRepository,
			useClass: ExperienceCategoryRepositoryImpl,
		},
		{
			provide: ReviewRepository,
			useClass: ReviewRepositoryImpl,
		},

		// Strategy
		OwnerStrategyResolver,
		OwnerInfoResolver,

		// Sub-table Use Cases
		CreateExperiencePricesUseCase,
		CreateExperienceAvailabilityUseCase,
		CreateExperienceItineraryUseCase,
		UpdateExperiencePricesUseCase,
		UpdateExperienceAvailabilityUseCase,
		UpdateExperienceItineraryUseCase,

		// Granular Patch Use Cases
		UpdatePriceByAgeGroupUseCase,
		UpdateExcludedDatesUseCase,
		UpdateAvailableDatesUseCase,
		GetSharedCapacityByDateRangeUseCase,

		// Main Use Cases
		CreateExperienceUseCase,
		UpdateExperienceUseCase,
		UpdateExperienceStatusUseCase,
		DeleteExperienceUseCase,
		GetAllExperiencesUseCase,
		GetAllExperiencesForManagementUseCase,
		GetByIdExperienceUseCase,
		GetAvailabilityModeByIdUseCase,
		GetFutureUnavailableDatesUseCase,
		GetExperienceForEditUseCase,

		CreateExperienceCategoryUseCase,
		CreateManyExperienceCategoriesUseCase,
		ListExperienceCategoriesUseCase,
		GetExperienceCategoryByIdUseCase,
		UpdateExperienceCategoryUseCase,
		DeleteExperienceCategoryUseCase,
	],
	exports: [
		ExperiencePricesRepository,
		ExperienceAvailabilityRepository,
		ExperienceItineraryRepository,
		ExperienceRepository,
		ReviewRepository,
		GetAvailabilityModeByIdUseCase,
	],
})
export class ExperienceModule {}

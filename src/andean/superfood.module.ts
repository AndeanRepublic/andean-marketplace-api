import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { SuperfoodProductSchema } from './infra/persistence/superfood/superfood.schema';
import { SuperfoodCategorySchema } from './infra/persistence/superfood/superfoodCategory.schema';
import { MediaItemSchema } from './infra/persistence/mediaItem.schema';
import { SuperfoodNutritionalFeatureSchema } from './infra/persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodBenefitSchema } from './infra/persistence/superfood/superfoodBenefit.schema';
import { SuperfoodPreservationMethodSchema } from './infra/persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodCertificationSchema } from './infra/persistence/superfood/superfoodCertification.schema';
import { SuperfoodSalesUnitSizeSchema } from './infra/persistence/superfood/superfoodSalesUnitSize.schema';
import { SuperfoodProductPresentationSchema } from './infra/persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodTypeSchema } from './infra/persistence/superfood/superfoodType.schema';

// Controller
import { SuperfoodController } from './infra/controllers/superfood.controller';

// Use Cases
import { CreateSuperfoodProductUseCase } from './app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetSuperfoodProductByIdUseCase } from './app/use_cases/superfoods/GetSuperfoodProductByIdUseCase';
import { GetSuperfoodProductsByOwnerUseCase } from './app/use_cases/superfoods/GetSuperfoodProductsByOwnerUseCase';
import { GetSuperfoodProductsByCategoryUseCase } from './app/use_cases/superfoods/GetSuperfoodProductsByCategoryUseCase';
import { UpdateSuperfoodProductUseCase } from './app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from './app/use_cases/superfoods/DeleteSuperfoodProductUseCase';

// Repositories (Abstract)
import { SuperfoodProductRepository } from './app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodCategoryRepository } from './app/datastore/superfoods/SuperfoodCategory.repo';
import { MediaItemRepository } from './app/datastore/MediaItem.repo';
import { SuperfoodTypeRepository } from './app/datastore/superfoods/SuperfoodType.repo';
import { SuperfoodNutritionalFeatureRepository } from './app/datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodBenefitRepository } from './app/datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodPreservationMethodRepository } from './app/datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodCertificationRepository } from './app/datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodSalesUnitSizeRepository } from './app/datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodProductPresentationRepository } from './app/datastore/superfoods/SuperfoodProductPresentation.repo';

// Repositories (Implementation)
import { SuperfoodProductRepoImpl } from './infra/datastore/superfood/superfoodProduct.repo.impl';
import { SuperfoodCategoryRepoImpl } from './infra/datastore/superfood/superfoodCategory.repo.impl';
import { MediaItemRepoImpl } from './infra/datastore/mediaItem.repo.impl';
import { SuperfoodTypeRepoImpl } from './infra/datastore/superfood/superfoodType.repo.impl';
import { SuperfoodNutritionalFeatureRepoImpl } from './infra/datastore/superfood/superfoodNutritionalFeature.repo.impl';
import { SuperfoodBenefitRepoImpl } from './infra/datastore/superfood/superfoodBenefit.repo.impl';
import { SuperfoodPreservationMethodRepoImpl } from './infra/datastore/superfood/superfoodPreservationMethod.repo.impl';
import { SuperfoodCertificationRepoImpl } from './infra/datastore/superfood/superfoodCertification.repo.impl';
import { SuperfoodSalesUnitSizeRepoImpl } from './infra/datastore/superfood/superfoodSalesUnitSize.repo.impl';
import { SuperfoodProductPresentationRepoImpl } from './infra/datastore/superfood/superfoodProductPresentation.repo.impl';

// Other modules
import { ShopsModule } from './shop.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'SuperfoodProduct', schema: SuperfoodProductSchema },
			{ name: 'SuperfoodCategory', schema: SuperfoodCategorySchema },
			{ name: 'MediaItem', schema: MediaItemSchema },
			{ name: 'SuperfoodNutritionalFeature', schema: SuperfoodNutritionalFeatureSchema },
			{ name: 'SuperfoodBenefit', schema: SuperfoodBenefitSchema },
			{ name: 'SuperfoodPreservationMethod', schema: SuperfoodPreservationMethodSchema },
			{ name: 'SuperfoodCertification', schema: SuperfoodCertificationSchema },
			{ name: 'SuperfoodSalesUnitSize', schema: SuperfoodSalesUnitSizeSchema },
			{ name: 'SuperfoodProductPresentation', schema: SuperfoodProductPresentationSchema },
			{ name: 'SuperfoodType', schema: SuperfoodTypeSchema },
		]),
		ShopsModule, // Para validar shops cuando ownerType = SHOP
		// CommunityModule cuando se implemente
	],
	controllers: [SuperfoodController],
	providers: [
		// Use Cases
		CreateSuperfoodProductUseCase,
		GetSuperfoodProductByIdUseCase,
		GetSuperfoodProductsByOwnerUseCase,
		GetSuperfoodProductsByCategoryUseCase,
		UpdateSuperfoodProductUseCase,
		DeleteSuperfoodProductUseCase,

		// Repository Bindings (Abstract → Implementation)
		{
			provide: SuperfoodProductRepository,
			useClass: SuperfoodProductRepoImpl,
		},
		{
			provide: SuperfoodCategoryRepository,
			useClass: SuperfoodCategoryRepoImpl,
		},
		{
			provide: MediaItemRepository,
			useClass: MediaItemRepoImpl,
		},
		{
			provide: SuperfoodTypeRepository,
			useClass: SuperfoodTypeRepoImpl,
		},
		{
			provide: SuperfoodNutritionalFeatureRepository,
			useClass: SuperfoodNutritionalFeatureRepoImpl,
		},
		{
			provide: SuperfoodBenefitRepository,
			useClass: SuperfoodBenefitRepoImpl,
		},
		{
			provide: SuperfoodPreservationMethodRepository,
			useClass: SuperfoodPreservationMethodRepoImpl,
		},
		{
			provide: SuperfoodCertificationRepository,
			useClass: SuperfoodCertificationRepoImpl,
		},
		{
			provide: SuperfoodSalesUnitSizeRepository,
			useClass: SuperfoodSalesUnitSizeRepoImpl,
		},
		{
			provide: SuperfoodProductPresentationRepository,
			useClass: SuperfoodProductPresentationRepoImpl,
		},
	],
	exports: [
		SuperfoodProductRepository,
		SuperfoodCategoryRepository,
		MediaItemRepository,
		SuperfoodTypeRepository,
		SuperfoodNutritionalFeatureRepository,
		SuperfoodBenefitRepository,
		SuperfoodPreservationMethodRepository,
		SuperfoodCertificationRepository,
		SuperfoodSalesUnitSizeRepository,
		SuperfoodProductPresentationRepository,
		MongooseModule,
	],
})
export class SuperfoodModule { }

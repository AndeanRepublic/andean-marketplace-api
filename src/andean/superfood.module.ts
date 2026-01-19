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

// Controllers
import { SuperfoodController } from './infra/controllers/superfood.controller';
import { SuperfoodCategoryController } from './infra/controllers/superfoodCategory.controller';
import { SuperfoodCertificationController } from './infra/controllers/superfoodCertification.controller';
import { SuperfoodTypeController } from './infra/controllers/superfoodType.controller';
import { SuperfoodPreservationMethodController } from './infra/controllers/superfoodPreservationMethod.controller';
import { SuperfoodNutritionalFeatureController } from './infra/controllers/superfoodNutritionalFeature.controller';
import { SuperfoodBenefitController } from './infra/controllers/superfoodBenefit.controller';
import { SuperfoodProductPresentationController } from './infra/controllers/superfoodProductPresentation.controller';
import { SuperfoodSalesUnitSizeController } from './infra/controllers/superfoodSalesUnitSize.controller';

// Use Cases - Product
import { CreateSuperfoodProductUseCase } from './app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetSuperfoodProductByIdUseCase } from './app/use_cases/superfoods/GetSuperfoodProductByIdUseCase';
import { GetSuperfoodProductsByOwnerUseCase } from './app/use_cases/superfoods/GetSuperfoodProductsByOwnerUseCase';
import { GetSuperfoodProductsByCategoryUseCase } from './app/use_cases/superfoods/GetSuperfoodProductsByCategoryUseCase';
import { UpdateSuperfoodProductUseCase } from './app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from './app/use_cases/superfoods/DeleteSuperfoodProductUseCase';

// Use Cases - Category
import { CreateSuperfoodCategoryUseCase } from './app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { GetSuperfoodCategoryByIdUseCase } from './app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from './app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from './app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';

// Use Cases - Certification
import { CreateSuperfoodCertificationUseCase } from './app/use_cases/superfoods/certification/CreateSuperfoodCertificationUseCase';
import { GetSuperfoodCertificationByIdUseCase } from './app/use_cases/superfoods/certification/GetSuperfoodCertificationByIdUseCase';
import { ListSuperfoodCertificationsUseCase } from './app/use_cases/superfoods/certification/ListSuperfoodCertificationsUseCase';
import { DeleteSuperfoodCertificationUseCase } from './app/use_cases/superfoods/certification/DeleteSuperfoodCertificationUseCase';

// Use Cases - Type
import { CreateSuperfoodTypeUseCase } from './app/use_cases/superfoods/type/CreateSuperfoodTypeUseCase';
import { GetSuperfoodTypeByIdUseCase } from './app/use_cases/superfoods/type/GetSuperfoodTypeByIdUseCase';
import { ListSuperfoodTypesUseCase } from './app/use_cases/superfoods/type/ListSuperfoodTypesUseCase';
import { DeleteSuperfoodTypeUseCase } from './app/use_cases/superfoods/type/DeleteSuperfoodTypeUseCase';

// Use Cases - Preservation Method
import { CreateSuperfoodPreservationMethodUseCase } from './app/use_cases/superfoods/preservationMethod/CreateSuperfoodPreservationMethodUseCase';
import { GetSuperfoodPreservationMethodByIdUseCase } from './app/use_cases/superfoods/preservationMethod/GetSuperfoodPreservationMethodByIdUseCase';
import { ListSuperfoodPreservationMethodsUseCase } from './app/use_cases/superfoods/preservationMethod/ListSuperfoodPreservationMethodsUseCase';
import { DeleteSuperfoodPreservationMethodUseCase } from './app/use_cases/superfoods/preservationMethod/DeleteSuperfoodPreservationMethodUseCase';

// Use Cases - Nutritional Feature
import { CreateSuperfoodNutritionalFeatureUseCase } from './app/use_cases/superfoods/nutritionalFeature/CreateSuperfoodNutritionalFeatureUseCase';
import { GetSuperfoodNutritionalFeatureByIdUseCase } from './app/use_cases/superfoods/nutritionalFeature/GetSuperfoodNutritionalFeatureByIdUseCase';
import { ListSuperfoodNutritionalFeaturesUseCase } from './app/use_cases/superfoods/nutritionalFeature/ListSuperfoodNutritionalFeaturesUseCase';
import { DeleteSuperfoodNutritionalFeatureUseCase } from './app/use_cases/superfoods/nutritionalFeature/DeleteSuperfoodNutritionalFeatureUseCase';

// Use Cases - Benefit
import { CreateSuperfoodBenefitUseCase } from './app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { GetSuperfoodBenefitByIdUseCase } from './app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from './app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from './app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';

// Use Cases - Product Presentation
import { CreateSuperfoodProductPresentationUseCase } from './app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from './app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from './app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from './app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';

// Use Cases - Sales Unit Size
import { CreateSuperfoodSalesUnitSizeUseCase } from './app/use_cases/superfoods/salesUnitSize/CreateSuperfoodSalesUnitSizeUseCase';
import { GetSuperfoodSalesUnitSizeByIdUseCase } from './app/use_cases/superfoods/salesUnitSize/GetSuperfoodSalesUnitSizeByIdUseCase';
import { ListSuperfoodSalesUnitSizesUseCase } from './app/use_cases/superfoods/salesUnitSize/ListSuperfoodSalesUnitSizesUseCase';
import { DeleteSuperfoodSalesUnitSizeUseCase } from './app/use_cases/superfoods/salesUnitSize/DeleteSuperfoodSalesUnitSizeUseCase';

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
import { CommunityModule } from './community.module';

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
		ShopsModule,
		CommunityModule,
	],
	controllers: [
		SuperfoodController,
		SuperfoodCategoryController,
		SuperfoodCertificationController,
		SuperfoodTypeController,
		SuperfoodPreservationMethodController,
		SuperfoodNutritionalFeatureController,
		SuperfoodBenefitController,
		SuperfoodProductPresentationController,
		SuperfoodSalesUnitSizeController,
	],
	providers: [
		// Use Cases - Product
		CreateSuperfoodProductUseCase,
		GetSuperfoodProductByIdUseCase,
		GetSuperfoodProductsByOwnerUseCase,
		GetSuperfoodProductsByCategoryUseCase,
		UpdateSuperfoodProductUseCase,
		DeleteSuperfoodProductUseCase,

		// Use Cases - Category
		CreateSuperfoodCategoryUseCase,
		GetSuperfoodCategoryByIdUseCase,
		ListSuperfoodCategoriesUseCase,
		DeleteSuperfoodCategoryUseCase,

		// Use Cases - Certification
		CreateSuperfoodCertificationUseCase,
		GetSuperfoodCertificationByIdUseCase,
		ListSuperfoodCertificationsUseCase,
		DeleteSuperfoodCertificationUseCase,

		// Use Cases - Type
		CreateSuperfoodTypeUseCase,
		GetSuperfoodTypeByIdUseCase,
		ListSuperfoodTypesUseCase,
		DeleteSuperfoodTypeUseCase,

		// Use Cases - Preservation Method
		CreateSuperfoodPreservationMethodUseCase,
		GetSuperfoodPreservationMethodByIdUseCase,
		ListSuperfoodPreservationMethodsUseCase,
		DeleteSuperfoodPreservationMethodUseCase,

		// Use Cases - Nutritional Feature
		CreateSuperfoodNutritionalFeatureUseCase,
		GetSuperfoodNutritionalFeatureByIdUseCase,
		ListSuperfoodNutritionalFeaturesUseCase,
		DeleteSuperfoodNutritionalFeatureUseCase,

		// Use Cases - Benefit
		CreateSuperfoodBenefitUseCase,
		GetSuperfoodBenefitByIdUseCase,
		ListSuperfoodBenefitsUseCase,
		DeleteSuperfoodBenefitUseCase,

		// Use Cases - Product Presentation
		CreateSuperfoodProductPresentationUseCase,
		GetSuperfoodProductPresentationByIdUseCase,
		ListSuperfoodProductPresentationsUseCase,
		DeleteSuperfoodProductPresentationUseCase,

		// Use Cases - Sales Unit Size
		CreateSuperfoodSalesUnitSizeUseCase,
		GetSuperfoodSalesUnitSizeByIdUseCase,
		ListSuperfoodSalesUnitSizesUseCase,
		DeleteSuperfoodSalesUnitSizeUseCase,

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

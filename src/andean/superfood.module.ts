import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { SuperfoodProductSchema } from './infra/persistence/superfood/superfood.schema';
import { SuperfoodCategorySchema } from './infra/persistence/superfood/superfoodCategory.schema';
import { SuperfoodNutritionalFeatureSchema } from './infra/persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodBenefitSchema } from './infra/persistence/superfood/superfoodBenefit.schema';
import { SuperfoodPreservationMethodSchema } from './infra/persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodCertificationSchema } from './infra/persistence/superfood/superfoodCertification.schema';
import { SuperfoodSalesUnitSizeSchema } from './infra/persistence/superfood/superfoodSalesUnitSize.schema';
import { SuperfoodProductPresentationSchema } from './infra/persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodTypeSchema } from './infra/persistence/superfood/superfoodType.schema';
import { SuperfoodColorCatalogSchema } from './infra/persistence/superfood/superfoodColor.schema';

// Controllers
import { SuperfoodController } from './infra/controllers/superfoodControllers/superfood.controller';
import { SuperfoodCategoryController } from './infra/controllers/superfoodControllers/superfoodCategory.controller';
import { SuperfoodCertificationController } from './infra/controllers/superfoodControllers/superfoodCertification.controller';
import { SuperfoodTypeController } from './infra/controllers/superfoodControllers/superfoodType.controller';
import { SuperfoodPreservationMethodController } from './infra/controllers/superfoodControllers/superfoodPreservationMethod.controller';
import { SuperfoodNutritionalFeatureController } from './infra/controllers/superfoodControllers/superfoodNutritionalFeature.controller';
import { SuperfoodBenefitController } from './infra/controllers/superfoodControllers/superfoodBenefit.controller';
import { SuperfoodProductPresentationController } from './infra/controllers/superfoodControllers/superfoodProductPresentation.controller';
import { SuperfoodSalesUnitSizeController } from './infra/controllers/superfoodControllers/superfoodSalesUnitSize.controller';
import { SuperfoodColorController } from './infra/controllers/superfoodControllers/superfoodColor.controller';
import { ReviewController } from './infra/controllers/Review.controller';

// Use Cases - Product
import { CreateSuperfoodProductUseCase } from './app/use_cases/superfoods/CreateSuperfoodProductUseCase';
import { GetAllSuperfoodProductsUseCase } from './app/use_cases/superfoods/GetAllSuperfoodProductsUseCase';
import { UpdateSuperfoodProductUseCase } from './app/use_cases/superfoods/UpdateSuperfoodProductUseCase';
import { DeleteSuperfoodProductUseCase } from './app/use_cases/superfoods/DeleteSuperfoodProductUseCase';
import { GetByIdSuperfoodProductDetailUseCase } from './app/use_cases/superfoods/GetByIdSuperfoodProductDetailUseCase';
import { GetSuperfoodProductByIdUseCase } from './app/use_cases/superfoods/GetSuperfoodProductByIdUseCase';
import { UpdateSuperfoodStatusUseCase } from './app/use_cases/superfoods/UpdateSuperfoodStatusUseCase';

// Use Cases - Category
import { CreateSuperfoodCategoryUseCase } from './app/use_cases/superfoods/category/CreateSuperfoodCategoryUseCase';
import { CreateManySuperfoodCategoriesUseCase } from './app/use_cases/superfoods/category/CreateManySuperfoodCategoriesUseCase';
import { GetSuperfoodCategoryByIdUseCase } from './app/use_cases/superfoods/category/GetSuperfoodCategoryByIdUseCase';
import { ListSuperfoodCategoriesUseCase } from './app/use_cases/superfoods/category/ListSuperfoodCategoriesUseCase';
import { DeleteSuperfoodCategoryUseCase } from './app/use_cases/superfoods/category/DeleteSuperfoodCategoryUseCase';

// Use Cases - Certification
import { CreateSuperfoodCertificationUseCase } from './app/use_cases/superfoods/certification/CreateSuperfoodCertificationUseCase';
import { CreateManySuperfoodCertificationsUseCase } from './app/use_cases/superfoods/certification/CreateManySuperfoodCertificationsUseCase';
import { GetSuperfoodCertificationByIdUseCase } from './app/use_cases/superfoods/certification/GetSuperfoodCertificationByIdUseCase';
import { ListSuperfoodCertificationsUseCase } from './app/use_cases/superfoods/certification/ListSuperfoodCertificationsUseCase';
import { DeleteSuperfoodCertificationUseCase } from './app/use_cases/superfoods/certification/DeleteSuperfoodCertificationUseCase';

// Use Cases - Type
import { CreateSuperfoodTypeUseCase } from './app/use_cases/superfoods/type/CreateSuperfoodTypeUseCase';
import { CreateManySuperfoodTypesUseCase } from './app/use_cases/superfoods/type/CreateManySuperfoodTypesUseCase';
import { GetSuperfoodTypeByIdUseCase } from './app/use_cases/superfoods/type/GetSuperfoodTypeByIdUseCase';
import { ListSuperfoodTypesUseCase } from './app/use_cases/superfoods/type/ListSuperfoodTypesUseCase';
import { DeleteSuperfoodTypeUseCase } from './app/use_cases/superfoods/type/DeleteSuperfoodTypeUseCase';

// Use Cases - Preservation Method
import { CreateSuperfoodPreservationMethodUseCase } from './app/use_cases/superfoods/preservationMethod/CreateSuperfoodPreservationMethodUseCase';
import { CreateManySuperfoodPreservationMethodsUseCase } from './app/use_cases/superfoods/preservationMethod/CreateManySuperfoodPreservationMethodsUseCase';
import { GetSuperfoodPreservationMethodByIdUseCase } from './app/use_cases/superfoods/preservationMethod/GetSuperfoodPreservationMethodByIdUseCase';
import { ListSuperfoodPreservationMethodsUseCase } from './app/use_cases/superfoods/preservationMethod/ListSuperfoodPreservationMethodsUseCase';
import { DeleteSuperfoodPreservationMethodUseCase } from './app/use_cases/superfoods/preservationMethod/DeleteSuperfoodPreservationMethodUseCase';

// Use Cases - Nutritional Feature
import { CreateSuperfoodNutritionalFeatureUseCase } from './app/use_cases/superfoods/nutritionalFeature/CreateSuperfoodNutritionalFeatureUseCase';
import { CreateManySuperfoodNutritionalFeaturesUseCase } from './app/use_cases/superfoods/nutritionalFeature/CreateManySuperfoodNutritionalFeaturesUseCase';
import { GetSuperfoodNutritionalFeatureByIdUseCase } from './app/use_cases/superfoods/nutritionalFeature/GetSuperfoodNutritionalFeatureByIdUseCase';
import { ListSuperfoodNutritionalFeaturesUseCase } from './app/use_cases/superfoods/nutritionalFeature/ListSuperfoodNutritionalFeaturesUseCase';
import { DeleteSuperfoodNutritionalFeatureUseCase } from './app/use_cases/superfoods/nutritionalFeature/DeleteSuperfoodNutritionalFeatureUseCase';

// Use Cases - Benefit
import { CreateSuperfoodBenefitUseCase } from './app/use_cases/superfoods/benefit/CreateSuperfoodBenefitUseCase';
import { CreateManySuperfoodBenefitsUseCase } from './app/use_cases/superfoods/benefit/CreateManySuperfoodBenefitsUseCase';
import { GetSuperfoodBenefitByIdUseCase } from './app/use_cases/superfoods/benefit/GetSuperfoodBenefitByIdUseCase';
import { ListSuperfoodBenefitsUseCase } from './app/use_cases/superfoods/benefit/ListSuperfoodBenefitsUseCase';
import { DeleteSuperfoodBenefitUseCase } from './app/use_cases/superfoods/benefit/DeleteSuperfoodBenefitUseCase';

// Use Cases - Product Presentation
import { CreateSuperfoodProductPresentationUseCase } from './app/use_cases/superfoods/productPresentation/CreateSuperfoodProductPresentationUseCase';
import { CreateManySuperfoodProductPresentationsUseCase } from './app/use_cases/superfoods/productPresentation/CreateManySuperfoodProductPresentationsUseCase';
import { GetSuperfoodProductPresentationByIdUseCase } from './app/use_cases/superfoods/productPresentation/GetSuperfoodProductPresentationByIdUseCase';
import { ListSuperfoodProductPresentationsUseCase } from './app/use_cases/superfoods/productPresentation/ListSuperfoodProductPresentationsUseCase';
import { DeleteSuperfoodProductPresentationUseCase } from './app/use_cases/superfoods/productPresentation/DeleteSuperfoodProductPresentationUseCase';

// Use Cases - Sales Unit Size
import { CreateSuperfoodSalesUnitSizeUseCase } from './app/use_cases/superfoods/salesUnitSize/CreateSuperfoodSalesUnitSizeUseCase';
import { CreateManySuperfoodSalesUnitSizesUseCase } from './app/use_cases/superfoods/salesUnitSize/CreateManySuperfoodSalesUnitSizesUseCase';
import { GetSuperfoodSalesUnitSizeByIdUseCase } from './app/use_cases/superfoods/salesUnitSize/GetSuperfoodSalesUnitSizeByIdUseCase';
import { ListSuperfoodSalesUnitSizesUseCase } from './app/use_cases/superfoods/salesUnitSize/ListSuperfoodSalesUnitSizesUseCase';
import { DeleteSuperfoodSalesUnitSizeUseCase } from './app/use_cases/superfoods/salesUnitSize/DeleteSuperfoodSalesUnitSizeUseCase';

// Use Cases - Color (catálogo)
import { CreateSuperfoodColorUseCase } from './app/use_cases/superfoods/color/CreateSuperfoodColorUseCase';
import { CreateManySuperfoodColorsUseCase } from './app/use_cases/superfoods/color/CreateManySuperfoodColorsUseCase';
import { ListSuperfoodColorsUseCase } from './app/use_cases/superfoods/color/ListSuperfoodColorsUseCase';
import { GetSuperfoodColorByIdUseCase } from './app/use_cases/superfoods/color/GetSuperfoodColorByIdUseCase';
import { DeleteSuperfoodColorUseCase } from './app/use_cases/superfoods/color/DeleteSuperfoodColorUseCase';

// Repositories (Abstract)
import { SuperfoodProductRepository } from './app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodCategoryRepository } from './app/datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodTypeRepository } from './app/datastore/superfoods/SuperfoodType.repo';
import { SuperfoodNutritionalFeatureRepository } from './app/datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodBenefitRepository } from './app/datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodPreservationMethodRepository } from './app/datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodCertificationRepository } from './app/datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodSalesUnitSizeRepository } from './app/datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodProductPresentationRepository } from './app/datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodColorRepository } from './app/datastore/superfoods/SuperfoodColor.repo';

// Repositories (Implementation)
import { SuperfoodProductRepoImpl } from './infra/datastore/superfood/superfoodProduct.repo.impl';
import { SuperfoodCategoryRepoImpl } from './infra/datastore/superfood/superfoodCategory.repo.impl';
import { SuperfoodTypeRepoImpl } from './infra/datastore/superfood/superfoodType.repo.impl';
import { SuperfoodNutritionalFeatureRepoImpl } from './infra/datastore/superfood/superfoodNutritionalFeature.repo.impl';
import { SuperfoodBenefitRepoImpl } from './infra/datastore/superfood/superfoodBenefit.repo.impl';
import { SuperfoodPreservationMethodRepoImpl } from './infra/datastore/superfood/superfoodPreservationMethod.repo.impl';
import { SuperfoodCertificationRepoImpl } from './infra/datastore/superfood/superfoodCertification.repo.impl';
import { SuperfoodSalesUnitSizeRepoImpl } from './infra/datastore/superfood/superfoodSalesUnitSize.repo.impl';
import { SuperfoodProductPresentationRepoImpl } from './infra/datastore/superfood/superfoodProductPresentation.repo.impl';
import { SuperfoodColorRepoImpl } from './infra/datastore/superfood/superfoodColor.repo.impl';

// Other modules
import { ShopsModule } from './shop.module';
import { CommunityModule } from './community.module';
import { MediaItemModule } from './mediaItem.module';
import { DetailSourceProductModule } from './detailSourceProduct.module';
import { ReviewSchema } from './infra/persistence/Review.schema';
import { AccountSchema } from './infra/persistence/account.schema';
import { ReviewRepository } from './app/datastore/Review.repo';
import { ReviewRepositoryImpl } from './infra/datastore/Review.repo.impl';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountReviewRepositoryImpl } from './infra/datastore/AccountReviewOnly.repo.impl';
import { CreateReviewUseCase } from './app/use_cases/CreateReviewUseCase';
import { GetAllReviewsUseCase } from './app/use_cases/GetAllReviewsUseCase';
import { GetByIdReviewUseCase } from './app/use_cases/GetByIdReviewUseCase';
import { UpdateReviewUseCase } from './app/use_cases/UpdateReviewUseCase';
import { DeleteReviewUseCase } from './app/use_cases/DeleteReviewUseCase';
import { IncrementLikesUseCase } from './app/use_cases/IncrementLikesUseCase';
import { IncrementDislikesUseCase } from './app/use_cases/IncrementDislikesUseCase';
import { DecrementLikesUseCase } from './app/use_cases/DecrementLikesUseCase';
import { DecrementDislikesUseCase } from './app/use_cases/DecrementDislikesUseCase';
import { UsersModule } from './users.module';
import { TextileProductModule } from './textileProduct.module';
import { OwnerInfoResolver } from './infra/services/owner/OwnerInfoResolver';
import { SuperfoodProductListColorResolver } from './infra/services/superfood/SuperfoodProductListColorResolver';
import { SuperfoodProductListMediaResolver } from './infra/services/superfood/SuperfoodProductListMediaResolver';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'SuperfoodProduct', schema: SuperfoodProductSchema },
			{ name: 'SuperfoodCategory', schema: SuperfoodCategorySchema },
			{
				name: 'SuperfoodNutritionalFeature',
				schema: SuperfoodNutritionalFeatureSchema,
			},
			{ name: 'SuperfoodBenefit', schema: SuperfoodBenefitSchema },
			{
				name: 'SuperfoodPreservationMethod',
				schema: SuperfoodPreservationMethodSchema,
			},
			{ name: 'SuperfoodCertification', schema: SuperfoodCertificationSchema },
			{ name: 'SuperfoodSalesUnitSize', schema: SuperfoodSalesUnitSizeSchema },
			{
				name: 'SuperfoodProductPresentation',
				schema: SuperfoodProductPresentationSchema,
			},
			{ name: 'SuperfoodType', schema: SuperfoodTypeSchema },
			{ name: 'SuperfoodColor', schema: SuperfoodColorCatalogSchema },
			{ name: 'Review', schema: ReviewSchema },
			{ name: 'Account', schema: AccountSchema },
		]),
		ShopsModule,
		CommunityModule,
		UsersModule,
		MediaItemModule,
		DetailSourceProductModule,
		forwardRef(() => TextileProductModule),
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
		SuperfoodColorController,
		ReviewController,
	],
	providers: [
		// Use Cases - Product
		CreateSuperfoodProductUseCase,
		GetAllSuperfoodProductsUseCase,
		UpdateSuperfoodProductUseCase,
		DeleteSuperfoodProductUseCase,
		GetByIdSuperfoodProductDetailUseCase,
		GetSuperfoodProductByIdUseCase,
		UpdateSuperfoodStatusUseCase,
		OwnerInfoResolver,
		SuperfoodProductListColorResolver,
		SuperfoodProductListMediaResolver,

		// Use Cases - Category
		CreateSuperfoodCategoryUseCase,
		CreateManySuperfoodCategoriesUseCase,
		GetSuperfoodCategoryByIdUseCase,
		ListSuperfoodCategoriesUseCase,
		DeleteSuperfoodCategoryUseCase,

		// Use Cases - Certification
		CreateSuperfoodCertificationUseCase,
		CreateManySuperfoodCertificationsUseCase,
		GetSuperfoodCertificationByIdUseCase,
		ListSuperfoodCertificationsUseCase,
		DeleteSuperfoodCertificationUseCase,

		// Use Cases - Type
		CreateSuperfoodTypeUseCase,
		CreateManySuperfoodTypesUseCase,
		GetSuperfoodTypeByIdUseCase,
		ListSuperfoodTypesUseCase,
		DeleteSuperfoodTypeUseCase,

		// Use Cases - Preservation Method
		CreateSuperfoodPreservationMethodUseCase,
		CreateManySuperfoodPreservationMethodsUseCase,
		GetSuperfoodPreservationMethodByIdUseCase,
		ListSuperfoodPreservationMethodsUseCase,
		DeleteSuperfoodPreservationMethodUseCase,

		// Use Cases - Nutritional Feature
		CreateSuperfoodNutritionalFeatureUseCase,
		CreateManySuperfoodNutritionalFeaturesUseCase,
		GetSuperfoodNutritionalFeatureByIdUseCase,
		ListSuperfoodNutritionalFeaturesUseCase,
		DeleteSuperfoodNutritionalFeatureUseCase,

		// Use Cases - Benefit
		CreateSuperfoodBenefitUseCase,
		CreateManySuperfoodBenefitsUseCase,
		GetSuperfoodBenefitByIdUseCase,
		ListSuperfoodBenefitsUseCase,
		DeleteSuperfoodBenefitUseCase,

		// Use Cases - Product Presentation
		CreateSuperfoodProductPresentationUseCase,
		CreateManySuperfoodProductPresentationsUseCase,
		GetSuperfoodProductPresentationByIdUseCase,
		ListSuperfoodProductPresentationsUseCase,
		DeleteSuperfoodProductPresentationUseCase,

		// Use Cases - Sales Unit Size
		CreateSuperfoodSalesUnitSizeUseCase,
		CreateManySuperfoodSalesUnitSizesUseCase,
		GetSuperfoodSalesUnitSizeByIdUseCase,
		ListSuperfoodSalesUnitSizesUseCase,
		DeleteSuperfoodSalesUnitSizeUseCase,

		// Use Cases - Color (catálogo)
		CreateSuperfoodColorUseCase,
		CreateManySuperfoodColorsUseCase,
		ListSuperfoodColorsUseCase,
		GetSuperfoodColorByIdUseCase,
		DeleteSuperfoodColorUseCase,

		// Use Cases - Review
		CreateReviewUseCase,
		GetAllReviewsUseCase,
		GetByIdReviewUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
		IncrementLikesUseCase,
		IncrementDislikesUseCase,
		DecrementLikesUseCase,
		DecrementDislikesUseCase,

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
		{
			provide: SuperfoodColorRepository,
			useClass: SuperfoodColorRepoImpl,
		},
		{
			provide: ReviewRepository,
			useClass: ReviewRepositoryImpl,
		},
		{
			provide: AccountRepository,
			useClass: AccountReviewRepositoryImpl,
		},
	],
	exports: [
		SuperfoodProductRepository,
		SuperfoodCategoryRepository,
		SuperfoodTypeRepository,
		SuperfoodNutritionalFeatureRepository,
		SuperfoodBenefitRepository,
		SuperfoodPreservationMethodRepository,
		SuperfoodCertificationRepository,
		SuperfoodSalesUnitSizeRepository,
		SuperfoodProductPresentationRepository,
		SuperfoodColorRepository,
		ReviewRepository,
		MongooseModule,
	],
})
export class SuperfoodModule {}

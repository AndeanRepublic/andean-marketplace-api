import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileCategorySchema } from './infra/persistence/textileProducts/textileCategory.schema';
import { TextileTypeSchema } from './infra/persistence/textileProducts/textileType.schema';
import { TextileStyleSchema } from './infra/persistence/textileProducts/textileStyle.schema';
import { TextileCraftTechniqueSchema } from './infra/persistence/textileProducts/textileCraftTechnique.schema';
import { TextilePrincipalUseSchema } from './infra/persistence/textileProducts/textilePrincipalUse.schema';
import { TextileProductSchema } from './infra/persistence/textileProducts/textileProduct.schema';
import { TextileCertificationSchema } from './infra/persistence/textileProducts/textileCertification.schema';
import { ColorOptionAlternativeSchema } from './infra/persistence/textileProducts/ColorOptionAlternative.schema';
import { SizeOptionAlternativeSchema } from './infra/persistence/textileProducts/SizeOptionAlternative.schema';
import { AccountSchema } from './infra/persistence/account.schema';
import { UsersModule } from './users.module';
import { ShopsModule } from './shop.module';
import { CommunityModule } from './community.module';
import { MediaItemModule } from './mediaItem.module';
import { OriginProductModule } from './originProduct.module';
import { ProviderInfoModule } from './providerInfo.module';
import { AccountRepository } from './app/datastore/Account.repo';
import { AccountReviewRepositoryImpl } from './infra/datastore/AccountReviewOnly.repo.impl';
import { CreateTextileCategoryUseCase } from './app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { CreateManyTextileCategoriesUseCase } from './app/use_cases/textileProducts/CreateManyTextileCategoriesUseCase';
import { TextileCategoryRepository } from './app/datastore/textileProducts/TextileCategory.repo';
import { TextileCategoryRepositoryImpl } from './infra/datastore/textileProducts/textileCategory.repo.impl';
import { TextileTypeRepository } from './app/datastore/textileProducts/TextileType.repo';
import { TextileTypeRepositoryImpl } from './infra/datastore/textileProducts/textileType.repo.impl';
import { TextileStyleRepository } from './app/datastore/textileProducts/TextileStyle.repo';
import { TextileStyleRepositoryImpl } from './infra/datastore/textileProducts/textileStyle.repo.impl';
import {
	TextileProductController,
	TextileCategoryController,
	TextileTypeController,
	TextileStyleController,
	TextileCraftTechniqueController,
	TextilePrincipalUseController,
	TextileCertificationController,
} from './infra/controllers/textileProductControllers';
import { ColorOptionAlternativeController } from './infra/controllers/colorOptionAlternative.controller';
import { SizeOptionAlternativeController } from './infra/controllers/sizeOptionAlternative.controller';
import { ReviewController } from './infra/controllers/Review.controller';
import { UpdateTextileCategoryUseCase } from './app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from './app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from './app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from './app/use_cases/textileProducts/DeleteTextileCategoryUseCase';
import { CreateTextileTypeUseCase } from './app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { CreateManyTextileTypesUseCase } from './app/use_cases/textileProducts/CreateManyTextileTypesUseCase';
import { UpdateTextileTypeUseCase } from './app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from './app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from './app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from './app/use_cases/textileProducts/DeleteTextileTypeUseCase';
import { CreateTextileStyleUseCase } from './app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { CreateManyTextileStylesUseCase } from './app/use_cases/textileProducts/CreateManyTextileStylesUseCase';
import { UpdateTextileStyleUseCase } from './app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from './app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from './app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from './app/use_cases/textileProducts/DeleteTextileStyleUseCase';
import { CreateTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { CreateManyTextileCraftTechniquesUseCase } from './app/use_cases/textileProducts/CreateManyTextileCraftTechniquesUseCase';
import { UpdateTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from './app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';
import { CreateTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { CreateManyTextilePrincipalUsesUseCase } from './app/use_cases/textileProducts/CreateManyTextilePrincipalUsesUseCase';
import { UpdateTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from './app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';
import { CreateTextileProductUseCase } from './app/use_cases/textileProducts/CreateTextileProductUseCase';
import { UpdateTextileProductUseCase } from './app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from './app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetTextileProductForSellerUseCase } from './app/use_cases/textileProducts/GetTextileProductForSellerUseCase';
import { GetByIdTextileProductDetailUseCase } from './app/use_cases/textileProducts/GetByIdTextileProductDetailUseCase';
import { DeleteTextileProductUseCase } from './app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { UpdateTextileProductStatusUseCase } from './app/use_cases/textileProducts/UpdateTextileProductStatusUseCase';
import { TextileCraftTechniqueRepository } from './app/datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechniqueRepositoryImpl } from './infra/datastore/textileProducts/textileCraftTechnique.repo.impl';
import { TextilePrincipalUseRepository } from './app/datastore/textileProducts/TextilePrincipalUse.repo';
import { TextilePrincipalUseRepositoryImpl } from './infra/datastore/textileProducts/textilePrincipalUse.repo.impl';
import { TextileProductRepository } from './app/datastore/textileProducts/TextileProduct.repo';
import { TextileProductRepositoryImpl } from './infra/datastore/textileProducts/textileProduct.repo.impl';
import { TextileCertificationRepository } from './app/datastore/textileProducts/TextileCertification.repo';
import { TextileCertificationRepositoryImpl } from './infra/datastore/textileProducts/textileCertification.repo.impl';
import { CreateTextileCertificationUseCase } from './app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { CreateManyTextileCertificationsUseCase } from './app/use_cases/textileProducts/CreateManyTextileCertificationsUseCase';
import { UpdateTextileCertificationUseCase } from './app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from './app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from './app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from './app/use_cases/textileProducts/DeleteTextileCertificationUseCase';
import { CreateColorOptionAlternativeUseCase } from './app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from './app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { GetAllColorOptionAlternativesUseCase } from './app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from './app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from './app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from './app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { ColorOptionAlternativeRepository } from './app/datastore/textileProducts/ColorOptionAlternative.repo';
import { ColorOptionAlternativeRepositoryImpl } from './infra/datastore/textileProducts/ColorOptionAlternative.repo.impl';
import { CreateSizeOptionAlternativeUseCase } from './app/use_cases/textileProducts/CreateSizeOptionAlternativeUseCase';
import { CreateManySizeOptionAlternativesUseCase } from './app/use_cases/textileProducts/CreateManySizeOptionAlternativesUseCase';
import { GetAllSizeOptionAlternativesUseCase } from './app/use_cases/textileProducts/GetAllSizeOptionAlternativesUseCase';
import { GetByIdSizeOptionAlternativeUseCase } from './app/use_cases/textileProducts/GetByIdSizeOptionAlternativeUseCase';
import { UpdateSizeOptionAlternativeUseCase } from './app/use_cases/textileProducts/UpdateSizeOptionAlternativeUseCase';
import { DeleteSizeOptionAlternativeUseCase } from './app/use_cases/textileProducts/DeleteSizeOptionAlternativeUseCase';
import { SizeOptionAlternativeRepository } from './app/datastore/textileProducts/SizeOptionAlternative.repo';
import { SizeOptionAlternativeRepositoryImpl } from './infra/datastore/textileProducts/SizeOptionAlternative.repo.impl';
import { CommunityRepositoryImpl } from './infra/datastore/community/community.repo.impl';
import { CommunityRepository } from './app/datastore/community/community.repo';
import { CommunitySchema } from './infra/persistence/community/community.schema';
import { ReviewSchema } from './infra/persistence/Review.schema';
import { ReviewRepository } from './app/datastore/Review.repo';
import { ReviewRepositoryImpl } from './infra/datastore/Review.repo.impl';
import { MediaItemRepository } from './app/datastore/MediaItem.repo';
import { MediaItemRepoImpl } from './infra/datastore/mediaItem.repo.impl';
import { CreateReviewUseCase } from './app/use_cases/CreateReviewUseCase';
import { GetAllReviewsUseCase } from './app/use_cases/GetAllReviewsUseCase';
import { GetByIdReviewUseCase } from './app/use_cases/GetByIdReviewUseCase';
import { UpdateReviewUseCase } from './app/use_cases/UpdateReviewUseCase';
import { DeleteReviewUseCase } from './app/use_cases/DeleteReviewUseCase';
import { IncrementLikesUseCase } from './app/use_cases/IncrementLikesUseCase';
import { IncrementDislikesUseCase } from './app/use_cases/IncrementDislikesUseCase';
import { DecrementLikesUseCase } from './app/use_cases/DecrementLikesUseCase';
import { DecrementDislikesUseCase } from './app/use_cases/DecrementDislikesUseCase';
import { SuperfoodModule } from './superfood.module';
import { VariantModule } from './variant.module';
import { VariantSchema } from './infra/persistence/variant.schema';
import { MediaItemSchema } from './infra/persistence/mediaItem.schema';
import { TextileProductAttributesAssembler } from './infra/services/textileProducts/TextileProductAttributesAssembler';
import { MediaUrlResolver } from './infra/services/media/MediaUrlResolver';
import { OwnerInfoResolver } from './infra/services/owner/OwnerInfoResolver';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'TextileCategory',
				schema: TextileCategorySchema,
			},
			{
				name: 'TextileType',
				schema: TextileTypeSchema,
			},
			{
				name: 'TextileStyle',
				schema: TextileStyleSchema,
			},
			{
				name: 'TextileCraftTechnique',
				schema: TextileCraftTechniqueSchema,
			},
			{
				name: 'TextilePrincipalUse',
				schema: TextilePrincipalUseSchema,
			},
			{
				name: 'TextileProduct',
				schema: TextileProductSchema,
			},
			{
				name: 'TextileCertification',
				schema: TextileCertificationSchema,
			},
			{
				name: 'ColorOptionAlternative',
				schema: ColorOptionAlternativeSchema,
			},
			{
				name: 'SizeOptionAlternative',
				schema: SizeOptionAlternativeSchema,
			},
			{
				name: 'Community',
				schema: CommunitySchema,
			},
			{
				name: 'Review',
				schema: ReviewSchema,
			},
			{
				name: 'Variant',
				schema: VariantSchema,
			},
			{
				name: 'MediaItem',
				schema: MediaItemSchema,
			},
			{
				name: 'Account',
				schema: AccountSchema,
			},
		]),
		UsersModule,
		ShopsModule,
		CommunityModule,
		ProviderInfoModule,
		OriginProductModule,
		forwardRef(() => VariantModule),
		MediaItemModule,
		forwardRef(() => SuperfoodModule),
	],
	controllers: [
		TextileCategoryController,
		TextileTypeController,
		TextileStyleController,
		TextileCraftTechniqueController,
		TextilePrincipalUseController,
		TextileCertificationController,
		ColorOptionAlternativeController,
		SizeOptionAlternativeController,
		ReviewController,
		TextileProductController, // Al final porque tiene rutas dinámicas /:id
	],
	providers: [
		CreateTextileCategoryUseCase,
		CreateManyTextileCategoriesUseCase,
		UpdateTextileCategoryUseCase,
		GetAllTextileCategoriesUseCase,
		GetByIdTextileCategoryUseCase,
		DeleteTextileCategoryUseCase,
		CreateTextileTypeUseCase,
		CreateManyTextileTypesUseCase,
		UpdateTextileTypeUseCase,
		GetAllTextileTypesUseCase,
		GetByIdTextileTypeUseCase,
		DeleteTextileTypeUseCase,
		CreateTextileStyleUseCase,
		CreateManyTextileStylesUseCase,
		UpdateTextileStyleUseCase,
		GetAllTextileStylesUseCase,
		GetByIdTextileStyleUseCase,
		DeleteTextileStyleUseCase,
		CreateTextileCraftTechniqueUseCase,
		CreateManyTextileCraftTechniquesUseCase,
		UpdateTextileCraftTechniqueUseCase,
		GetAllTextileCraftTechniquesUseCase,
		GetByIdTextileCraftTechniqueUseCase,
		DeleteTextileCraftTechniqueUseCase,
		CreateTextilePrincipalUseUseCase,
		CreateManyTextilePrincipalUsesUseCase,
		UpdateTextilePrincipalUseUseCase,
		GetAllTextilePrincipalUsesUseCase,
		GetByIdTextilePrincipalUseUseCase,
		DeleteTextilePrincipalUseUseCase,
		CreateTextileProductUseCase,
		UpdateTextileProductUseCase,
		GetAllTextileProductsUseCase,
		GetTextileProductForSellerUseCase,
		GetByIdTextileProductDetailUseCase,
		DeleteTextileProductUseCase,
		UpdateTextileProductStatusUseCase,
		CreateTextileCertificationUseCase,
		CreateManyTextileCertificationsUseCase,
		UpdateTextileCertificationUseCase,
		GetAllTextileCertificationsUseCase,
		GetByIdTextileCertificationUseCase,
		DeleteTextileCertificationUseCase,
		CreateColorOptionAlternativeUseCase,
		CreateManyColorOptionAlternativesUseCase,
		GetAllColorOptionAlternativesUseCase,
		GetByIdColorOptionAlternativeUseCase,
		UpdateColorOptionAlternativeUseCase,
		DeleteColorOptionAlternativeUseCase,
		CreateSizeOptionAlternativeUseCase,
		CreateManySizeOptionAlternativesUseCase,
		GetAllSizeOptionAlternativesUseCase,
		GetByIdSizeOptionAlternativeUseCase,
		UpdateSizeOptionAlternativeUseCase,
		DeleteSizeOptionAlternativeUseCase,
		CreateReviewUseCase,
		GetAllReviewsUseCase,
		GetByIdReviewUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
		IncrementLikesUseCase,
		IncrementDislikesUseCase,
		DecrementLikesUseCase,
		DecrementDislikesUseCase,
		TextileProductAttributesAssembler,
		MediaUrlResolver,
		OwnerInfoResolver,
		{
			provide: TextileCategoryRepository,
			useClass: TextileCategoryRepositoryImpl,
		},
		{
			provide: TextileTypeRepository,
			useClass: TextileTypeRepositoryImpl,
		},
		{
			provide: TextileStyleRepository,
			useClass: TextileStyleRepositoryImpl,
		},
		{
			provide: TextileCraftTechniqueRepository,
			useClass: TextileCraftTechniqueRepositoryImpl,
		},
		{
			provide: TextilePrincipalUseRepository,
			useClass: TextilePrincipalUseRepositoryImpl,
		},
		{
			provide: TextileProductRepository,
			useClass: TextileProductRepositoryImpl,
		},
		{
			provide: TextileCertificationRepository,
			useClass: TextileCertificationRepositoryImpl,
		},
		{
			provide: ColorOptionAlternativeRepository,
			useClass: ColorOptionAlternativeRepositoryImpl,
		},
		{
			provide: SizeOptionAlternativeRepository,
			useClass: SizeOptionAlternativeRepositoryImpl,
		},
		{
			provide: CommunityRepository,
			useClass: CommunityRepositoryImpl,
		},
		{
			provide: ReviewRepository,
			useClass: ReviewRepositoryImpl,
		},
		{
			provide: MediaItemRepository,
			useClass: MediaItemRepoImpl,
		},
		{
			provide: AccountRepository,
			useClass: AccountReviewRepositoryImpl,
		},
	],
	exports: [
		MediaUrlResolver,
		TextileProductAttributesAssembler,
		TextileCategoryRepository,
		TextileTypeRepository,
		TextileStyleRepository,
		TextileCraftTechniqueRepository,
		TextilePrincipalUseRepository,
		TextileProductRepository,
		TextileCertificationRepository,
		ColorOptionAlternativeRepository,
		SizeOptionAlternativeRepository,
		ReviewRepository,
		MediaItemRepository,
		MongooseModule,
	],
})
export class TextileProductModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileCategorySchema } from './infra/persistence/textileProducts/textileCategory.schema';
import { TextileTypeSchema } from './infra/persistence/textileProducts/textileType.schema';
import { TextileStyleSchema } from './infra/persistence/textileProducts/textileStyle.schema';
import { TextileSubcategorySchema } from './infra/persistence/textileProducts/textileSubcategory.schema';
import { TextileCraftTechniqueSchema } from './infra/persistence/textileProducts/textileCraftTechnique.schema';
import { TextilePrincipalUseSchema } from './infra/persistence/textileProducts/textilePrincipalUse.schema';
import { TextileProductSchema } from './infra/persistence/textileProducts/textileProduct.schema';
import { TextileCertificationSchema } from './infra/persistence/textileProducts/textileCertification.schema';
import { UsersModule } from './users.module';
import { ShopsModule } from './shop.module';
import { OriginProductModule } from './originProduct.module';
import { CreateTextileCategoryUseCase } from './app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategoryRepository } from './app/datastore/textileProducts/TextileCategory.repo';
import { TextileCategoryRepositoryImpl } from './infra/datastore/textileProducts/textileCategory.repo.impl';
import { TextileTypeRepository } from './app/datastore/textileProducts/TextileType.repo';
import { TextileTypeRepositoryImpl } from './infra/datastore/textileProducts/textileType.repo.impl';
import { TextileStyleRepository } from './app/datastore/textileProducts/TextileStyle.repo';
import { TextileStyleRepositoryImpl } from './infra/datastore/textileProducts/textileStyle.repo.impl';
import { TextileSubcategoryRepository } from './app/datastore/textileProducts/TextileSubcategory.repo';
import { TextileSubcategoryRepositoryImpl } from './infra/datastore/textileProducts/textileSubcategory.repo.impl';
import { TextileProductController } from './infra/controllers/textileProduct.controller';
import { UpdateTextileCategoryUseCase } from './app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from './app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from './app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from './app/use_cases/textileProducts/DeleteTextileCategoryUseCase';
import { CreateTextileTypeUseCase } from './app/use_cases/textileProducts/CreateTextileTypeUseCase';
import { UpdateTextileTypeUseCase } from './app/use_cases/textileProducts/UpdateTextileTypeUseCase';
import { GetAllTextileTypesUseCase } from './app/use_cases/textileProducts/GetAllTextileTypesUseCase';
import { GetByIdTextileTypeUseCase } from './app/use_cases/textileProducts/GetByIdTextileTypeUseCase';
import { DeleteTextileTypeUseCase } from './app/use_cases/textileProducts/DeleteTextileTypeUseCase';
import { CreateTextileStyleUseCase } from './app/use_cases/textileProducts/CreateTextileStyleUseCase';
import { UpdateTextileStyleUseCase } from './app/use_cases/textileProducts/UpdateTextileStyleUseCase';
import { GetAllTextileStylesUseCase } from './app/use_cases/textileProducts/GetAllTextileStylesUseCase';
import { GetByIdTextileStyleUseCase } from './app/use_cases/textileProducts/GetByIdTextileStyleUseCase';
import { DeleteTextileStyleUseCase } from './app/use_cases/textileProducts/DeleteTextileStyleUseCase';
import { CreateTextileSubcategoryUseCase } from './app/use_cases/textileProducts/CreateTextileSubcategoryUseCase';
import { UpdateTextileSubcategoryUseCase } from './app/use_cases/textileProducts/UpdateTextileSubcategoryUseCase';
import { GetAllTextileSubcategoriesUseCase } from './app/use_cases/textileProducts/GetAllTextileSubcategoriesUseCase';
import { GetByIdTextileSubcategoryUseCase } from './app/use_cases/textileProducts/GetByIdTextileSubcategoryUseCase';
import { DeleteTextileSubcategoryUseCase } from './app/use_cases/textileProducts/DeleteTextileSubcategoryUseCase';
import { CreateTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/CreateTextileCraftTechniqueUseCase';
import { UpdateTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/UpdateTextileCraftTechniqueUseCase';
import { GetAllTextileCraftTechniquesUseCase } from './app/use_cases/textileProducts/GetAllTextileCraftTechniquesUseCase';
import { GetByIdTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/GetByIdTextileCraftTechniqueUseCase';
import { DeleteTextileCraftTechniqueUseCase } from './app/use_cases/textileProducts/DeleteTextileCraftTechniqueUseCase';
import { CreateTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/CreateTextilePrincipalUseUseCase';
import { UpdateTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/UpdateTextilePrincipalUseUseCase';
import { GetAllTextilePrincipalUsesUseCase } from './app/use_cases/textileProducts/GetAllTextilePrincipalUsesUseCase';
import { GetByIdTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/GetByIdTextilePrincipalUseUseCase';
import { DeleteTextilePrincipalUseUseCase } from './app/use_cases/textileProducts/DeleteTextilePrincipalUseUseCase';
import { CreateTextileProductUseCase } from './app/use_cases/textileProducts/CreateTextileProductUseCase';
import { UpdateTextileProductUseCase } from './app/use_cases/textileProducts/UpdateTextileProductUseCase';
import { GetAllTextileProductsUseCase } from './app/use_cases/textileProducts/GetAllTextileProductsUseCase';
import { GetByIdTextileProductUseCase } from './app/use_cases/textileProducts/GetByIdTextileProductUseCase';
import { DeleteTextileProductUseCase } from './app/use_cases/textileProducts/DeleteTextileProductUseCase';
import { TextileCraftTechniqueRepository } from './app/datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechniqueRepositoryImpl } from './infra/datastore/textileProducts/textileCraftTechnique.repo.impl';
import { TextilePrincipalUseRepository } from './app/datastore/textileProducts/TextilePrincipalUse.repo';
import { TextilePrincipalUseRepositoryImpl } from './infra/datastore/textileProducts/textilePrincipalUse.repo.impl';
import { TextileProductRepository } from './app/datastore/textileProducts/TextileProduct.repo';
import { TextileProductRepositoryImpl } from './infra/datastore/textileProducts/textileProduct.repo.impl';
import { TextileCertificationRepository } from './app/datastore/textileProducts/TextileCertification.repo';
import { TextileCertificationRepositoryImpl } from './infra/datastore/textileProducts/textileCertification.repo.impl';
import { CreateTextileCertificationUseCase } from './app/use_cases/textileProducts/CreateTextileCertificationUseCase';
import { UpdateTextileCertificationUseCase } from './app/use_cases/textileProducts/UpdateTextileCertificationUseCase';
import { GetAllTextileCertificationsUseCase } from './app/use_cases/textileProducts/GetAllTextileCertificationsUseCase';
import { GetByIdTextileCertificationUseCase } from './app/use_cases/textileProducts/GetByIdTextileCertificationUseCase';
import { DeleteTextileCertificationUseCase } from './app/use_cases/textileProducts/DeleteTextileCertificationUseCase';
import { CommunityRepositoryImpl } from './infra/datastore/community.repo.impl';
import { CommunityRepository } from './app/datastore/community.repo';
import { CommunitySchema } from './infra/persistence/community.schema';

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
        name: 'TextileSubcategory',
        schema: TextileSubcategorySchema,
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
        name: 'Community',
        schema: CommunitySchema,
      },
    ]),
    UsersModule,
    ShopsModule,
    OriginProductModule,
  ],
  controllers: [TextileProductController],
  providers: [
    CreateTextileCategoryUseCase,
    UpdateTextileCategoryUseCase,
    GetAllTextileCategoriesUseCase,
    GetByIdTextileCategoryUseCase,
    DeleteTextileCategoryUseCase,
    CreateTextileTypeUseCase,
    UpdateTextileTypeUseCase,
    GetAllTextileTypesUseCase,
    GetByIdTextileTypeUseCase,
    DeleteTextileTypeUseCase,
    CreateTextileStyleUseCase,
    UpdateTextileStyleUseCase,
    GetAllTextileStylesUseCase,
    GetByIdTextileStyleUseCase,
    DeleteTextileStyleUseCase,
    CreateTextileSubcategoryUseCase,
    UpdateTextileSubcategoryUseCase,
    GetAllTextileSubcategoriesUseCase,
    GetByIdTextileSubcategoryUseCase,
    DeleteTextileSubcategoryUseCase,
    CreateTextileCraftTechniqueUseCase,
    UpdateTextileCraftTechniqueUseCase,
    GetAllTextileCraftTechniquesUseCase,
    GetByIdTextileCraftTechniqueUseCase,
    DeleteTextileCraftTechniqueUseCase,
    CreateTextilePrincipalUseUseCase,
    UpdateTextilePrincipalUseUseCase,
    GetAllTextilePrincipalUsesUseCase,
    GetByIdTextilePrincipalUseUseCase,
    DeleteTextilePrincipalUseUseCase,
    CreateTextileProductUseCase,
    UpdateTextileProductUseCase,
    GetAllTextileProductsUseCase,
    GetByIdTextileProductUseCase,
    DeleteTextileProductUseCase,
    CreateTextileCertificationUseCase,
    UpdateTextileCertificationUseCase,
    GetAllTextileCertificationsUseCase,
    GetByIdTextileCertificationUseCase,
    DeleteTextileCertificationUseCase,
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
      provide: TextileSubcategoryRepository,
      useClass: TextileSubcategoryRepositoryImpl,
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
      provide: CommunityRepository,
      useClass: CommunityRepositoryImpl,
    },
  ],
  exports: [
    TextileCategoryRepository,
    TextileTypeRepository,
    TextileStyleRepository,
    TextileSubcategoryRepository,
    TextileCraftTechniqueRepository,
    TextilePrincipalUseRepository,
    TextileProductRepository,
    TextileCertificationRepository,
    MongooseModule,
  ],
})
export class TextileProductModule {}

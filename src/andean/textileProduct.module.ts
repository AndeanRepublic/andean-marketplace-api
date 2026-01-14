import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileCategorySchema } from './infra/persistence/textileProducts/textileCategory.schema';
import { TextileTypeSchema } from './infra/persistence/textileProducts/textileType.schema';
import { TextileStyleSchema } from './infra/persistence/textileProducts/textileStyle.schema';
import { TextileSubcategorySchema } from './infra/persistence/textileProducts/textileSubcategory.schema';
import { TextileCraftTechniqueSchema } from './infra/persistence/textileProducts/textileCraftTechnique.schema';
import { UsersModule } from './users.module';
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
import { TextileCraftTechniqueRepository } from './app/datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechniqueRepositoryImpl } from './infra/datastore/textileProducts/textileCraftTechnique.repo.impl';

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
    ]),
    UsersModule,
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
  ],
  exports: [
    TextileCategoryRepository,
    TextileTypeRepository,
    TextileStyleRepository,
    TextileSubcategoryRepository,
    TextileCraftTechniqueRepository,
    MongooseModule,
  ],
})
export class TextileProductModule {}

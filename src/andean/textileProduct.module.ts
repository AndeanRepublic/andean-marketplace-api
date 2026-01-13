import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileCategorySchema } from './infra/persistence/textileProducts/textileCategory.schema';
import { TextileTypeSchema } from './infra/persistence/textileProducts/textileType.schema';
import { UsersModule } from './users.module';
import { CreateTextileCategoryUseCase } from './app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategoryRepository } from './app/datastore/textileProducts/TextileCategory.repo';
import { TextileCategoryRepositoryImpl } from './infra/datastore/textileProducts/textileCategory.repo.impl';
import { TextileTypeRepository } from './app/datastore/textileProducts/TextileType.repo';
import { TextileTypeRepositoryImpl } from './infra/datastore/textileProducts/textileType.repo.impl';
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
    {
      provide: TextileCategoryRepository,
      useClass: TextileCategoryRepositoryImpl,
    },
    {
      provide: TextileTypeRepository,
      useClass: TextileTypeRepositoryImpl,
    },
  ],
  exports: [TextileCategoryRepository, TextileTypeRepository, MongooseModule],
})
export class TextileProductModule {}

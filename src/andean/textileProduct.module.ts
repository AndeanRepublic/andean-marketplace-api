import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextileCategorySchema } from './infra/persistence/textileProducts/textileCategory.schema';
import { UsersModule } from './users.module';
import { CreateTextileCategoryUseCase } from './app/use_cases/textileProducts/CreateTextileCategoryUseCase';
import { TextileCategoryRepository } from './app/datastore/textileProducts/TextileCategory.repo';
import { TextileCategoryRepositoryImpl } from './infra/datastore/textileProducts/textileCategory.repo.impl';
import { TextileProductController } from './infra/controllers/textileProduct.controller';
import { UpdateTextileCategoryUseCase } from './app/use_cases/textileProducts/UpdateTextileCategoryUseCase';
import { GetAllTextileCategoriesUseCase } from './app/use_cases/textileProducts/GetAllTextileCategoriesUseCase';
import { GetByIdTextileCategoryUseCase } from './app/use_cases/textileProducts/GetByIdTextileCategoryUseCase';
import { DeleteTextileCategoryUseCase } from './app/use_cases/textileProducts/DeleteTextileCategoryUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TextileCategory',
        schema: TextileCategorySchema,
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
    {
      provide: TextileCategoryRepository,
      useClass: TextileCategoryRepositoryImpl,
    },
  ],
  exports: [TextileCategoryRepository, MongooseModule],
})
export class TextileProductModule {}

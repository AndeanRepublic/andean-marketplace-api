import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './infra/persistence/product.schema';
import { ProductController } from './infra/controllers/product.controller';
import { ProductRepository } from './app/datastore/product.repo';
import { ProductRepoImpl } from './infra/datastore/product.repo.impl';
import { CreateProductUseCase } from './app/use_cases/products/CreateProductUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    {
      provide: ProductRepository,
      useClass: ProductRepoImpl,
    },
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}

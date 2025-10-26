import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './infra/persistence/product.schema';
import { ProductController } from './infra/controllers/product.controller';
import { ProductRepository } from './app/datastore/Product.repo';
import { ProductRepoImpl } from './infra/datastore/product.repo.impl';
import { CreateProductUseCase } from './app/use_cases/products/CreateProductUseCase';
import { GetProductsBySellerIdUseCase } from './app/use_cases/products/GetProductsBySellerIdUseCase';
import { DeleteProductUseCase } from './app/use_cases/products/DeleteProductUseCase';
import { GetProductByIdUseCase } from './app/use_cases/products/GetProductByIdUseCase';
import { GetProductsByShopUseCase } from './app/use_cases/products/GetProductsByShopUseCase';
import { ShopRepository } from './app/datastore/Shop.repo';
import { ShopRepoImpl } from './infra/datastore/shop.repo.impl';

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
    GetProductsBySellerIdUseCase,
    GetProductsByShopUseCase,
    DeleteProductUseCase,
    GetProductByIdUseCase,
    {
      provide: ProductRepository,
      useClass: ProductRepoImpl,
    },
    {
      provide: ShopRepository,
      useClass: ShopRepoImpl,
    },
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}

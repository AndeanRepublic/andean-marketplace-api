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
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { ShopsModule } from './shop.module';
import { UsersModule } from './users.module';
import { CreateVariantUseCase } from './app/use_cases/products/CreateVariantUseCase';
import { ProductVariantRepository } from './app/datastore/ProductVariant.repo';
import { ProductVariantRepoImpl } from './infra/datastore/productVariant.repo.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchema,
      },
    ]),
    ShopsModule,
    UsersModule,
  ],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    GetProductsBySellerIdUseCase,
    GetProductsByShopUseCase,
    DeleteProductUseCase,
    GetProductByIdUseCase,
    CreateVariantUseCase,
    {
      provide: ProductRepository,
      useClass: ProductRepoImpl,
    },
    {
      provide: ShopRepository,
      useClass: ShopRepoImpl,
    },
    {
      provide: SellerProfileRepository,
      useClass: SellerProfileRepositoryImpl,
    },
    {
      provide: ProductVariantRepository,
      useClass: ProductVariantRepoImpl,
    },
  ],
  exports: [ProductRepository, MongooseModule],
})
export class ProductsModule {}

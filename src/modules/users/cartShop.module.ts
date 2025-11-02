import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartShopSchema } from './infra/persistence/cartShop.schema';
import { CartShopController } from './infra/controllers/cartShop.controller';
import { AddItemToCartUseCase } from './app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from './app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByUserUseCase } from './app/use_cases/cart_shop/GetCartByUserUseCase';
import { RemoveItemFromCartUseCase } from './app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { ProductRepository } from './app/datastore/Product.repo';
import { ProductRepoImpl } from './infra/datastore/product.repo.impl';
import { UserRepository } from './app/datastore/Customer.repo';
import { UserRepositoryImpl } from './infra/datastore/user.repo.impl';
import { CartShopRepository } from './app/datastore/CartShop.repo';
import { CartShopRepoImpl } from './infra/datastore/cartShop.repo.impl';
import { ProductsModule } from './product.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CartShop',
        schema: CartShopSchema,
      },
    ]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [CartShopController],
  providers: [
    AddItemToCartUseCase,
    CleanCartUseCase,
    GetCartByUserUseCase,
    RemoveItemFromCartUseCase,
    {
      provide: ProductRepository,
      useClass: ProductRepoImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CartShopRepository,
      useClass: CartShopRepoImpl,
    },
  ],
})
export class CartShopModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './infra/persistence/shop.schema';
import { ShopController } from './infra/controllers/shop.controller';
import { CreateShopUseCase } from './app/use_cases/shops/CreateShopUseCase';
import { ShopRepository } from './app/datastore/Shop.repo';
import { ShopRepoImpl } from './infra/datastore/shop.repo.impl';
import { SellerRepository } from './app/datastore/Seller.repo';
import { SellerRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { GetShopByIdUseCase } from './app/use_cases/shops/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from './app/use_cases/shops/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from './app/use_cases/shops/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from './app/use_cases/shops/DeleteShopUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Shop',
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [ShopController],
  providers: [
    CreateShopUseCase,
    GetShopByIdUseCase,
    GetShopsByCategoryUseCase,
    GetShopsBySellerIdUseCase,
    DeleteShopUseCase,
    {
      provide: ShopRepository,
      useClass: ShopRepoImpl,
    },
    {
      provide: SellerRepository,
      useClass: SellerRepositoryImpl,
    },
  ],
  exports: [ShopRepository],
})
export class ShopsModule {}

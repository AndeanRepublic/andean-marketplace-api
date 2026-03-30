import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './infra/persistence/shop.schema';
import { ShopController } from './infra/controllers/shop.controller';
import { ProviderInfoModule } from './providerInfo.module';
import { CreateShopUseCase } from './app/use_cases/shops/CreateShopUseCase';
import { ShopRepository } from './app/datastore/Shop.repo';
import { ShopRepoImpl } from './infra/datastore/shop.repo.impl';
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { GetShopByIdUseCase } from './app/use_cases/shops/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from './app/use_cases/shops/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from './app/use_cases/shops/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from './app/use_cases/shops/DeleteShopUseCase';
import { UpdateShopUseCase } from './app/use_cases/shops/UpdateShopUseCase';
import { ListAllShopsUseCase } from './app/use_cases/shops/ListAllShopsUseCase';
import { UsersModule } from './users.module';
import { MediaItemModule } from './mediaItem.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Shop', schema: ShopSchema }]),
		UsersModule,
		ProviderInfoModule,
		MediaItemModule,
	],
	controllers: [ShopController],
	providers: [
		CreateShopUseCase,
		GetShopByIdUseCase,
		GetShopsByCategoryUseCase,
		GetShopsBySellerIdUseCase,
		DeleteShopUseCase,
		UpdateShopUseCase,
		ListAllShopsUseCase,
		{
			provide: ShopRepository,
			useClass: ShopRepoImpl,
		},
		{
			provide: SellerProfileRepository,
			useClass: SellerProfileRepositoryImpl,
		},
	],
	exports: [ShopRepository, MongooseModule],
})
export class ShopsModule {}

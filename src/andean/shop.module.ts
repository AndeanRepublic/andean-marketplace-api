import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './infra/persistence/shop/shop.schema';
import { ShopController } from './infra/controllers/shop/shop.controller';
import { ProviderInfoModule } from './providerInfo.module';
import { CreateShopUseCase } from './app/use_cases/shop/CreateShopUseCase';
import { ShopRepository } from './app/datastore/shop/Shop.repo';
import { ShopRepoImpl } from './infra/datastore/shop/shop.repo.impl';
import { CommunityModule } from './community.module';
import { SellerProfileRepository } from './app/datastore/Seller.repo';
import { SellerProfileRepositoryImpl } from './infra/datastore/seller.repo.impl';
import { GetShopByIdUseCase } from './app/use_cases/shop/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from './app/use_cases/shop/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from './app/use_cases/shop/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from './app/use_cases/shop/DeleteShopUseCase';
import { UpdateShopUseCase } from './app/use_cases/shop/UpdateShopUseCase';
import { ListAllShopsUseCase } from './app/use_cases/shop/ListAllShopsUseCase';
import { UpdateShopStatusUseCase } from './app/use_cases/shop/UpdateShopStatusUseCase';
import { UsersModule } from './users.module';
import { MediaItemModule } from './mediaItem.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Shop', schema: ShopSchema }]),
		UsersModule,
		ProviderInfoModule,
		MediaItemModule,
		CommunityModule,
	],
	controllers: [ShopController],
	providers: [
		CreateShopUseCase,
		GetShopByIdUseCase,
		GetShopsByCategoryUseCase,
		GetShopsBySellerIdUseCase,
		DeleteShopUseCase,
		UpdateShopUseCase,
		UpdateShopStatusUseCase,
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

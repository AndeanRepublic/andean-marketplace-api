import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CartShopSchema } from './infra/persistence/cartShop.schema';
import { CartShopController } from './infra/controllers/cartShop.controller';
import { AddItemToCartUseCase } from './app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from './app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from './app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { RemoveItemFromCartUseCase } from './app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { UpdateCartItemQuantityUseCase } from './app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { ApplyDiscountCodeUseCase } from './app/use_cases/cart_shop/ApplyDiscountCodeUseCase';
import { CustomerProfileRepository } from './app/datastore/Customer.repo';
import { CustomerProfileRepositoryImpl } from './infra/datastore/customer.repo.impl';
import { CartShopRepository } from './app/datastore/CartShop.repo';
import { CartShopRepoImpl } from './infra/datastore/cart/cartShop.repo.impl';
import { UsersModule } from './users.module';
import { CartItemSchema } from './infra/persistence/cartShopItem.schema';
import { CartShopItemRepository } from './app/datastore/CartShopItem.repo';
import { CartShopItemRepoImpl } from './infra/datastore/cart/cartShopItem.repo.impl';
import { VariantModule } from './variant.module';
import { TextileProductModule } from './textileProduct.module';
import { SuperfoodModule } from './superfood.module';
import { CommunityModule } from './community.module';
import { DiscountCodeService } from './infra/services/DiscountCodeService';
import { TextileProductInfoProvider } from './infra/services/products/TextileProductInfoProvider';
import { SuperfoodProductInfoProvider } from './infra/services/products/SuperfoodProductInfoProvider';
import { BoxProductInfoProvider } from './infra/services/products/BoxProductInfoProvider';
import { ProductInfoProviderRegistry } from './infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from './infra/services/OwnerNameResolver';
import { BoxCartContentResolver } from './infra/services/cart/BoxCartContentResolver';
import { BoxModule } from './box.module';
import { AuthModule } from './auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'CartShop',
				schema: CartShopSchema,
			},
			{
				name: 'CartShopItem',
				schema: CartItemSchema,
			},
		]),
		HttpModule,
		UsersModule,
		VariantModule,
		TextileProductModule,
		SuperfoodModule,
		CommunityModule,
		BoxModule,
		AuthModule,
	],
	controllers: [CartShopController],
	providers: [
		AddItemToCartUseCase,
		CleanCartUseCase,
		GetCartByCustomerUseCase,
		RemoveItemFromCartUseCase,
		UpdateCartItemQuantityUseCase,
		ApplyDiscountCodeUseCase,
		DiscountCodeService,
		{
			provide: CartShopItemRepository,
			useClass: CartShopItemRepoImpl,
		},
		{
			provide: CustomerProfileRepository,
			useClass: CustomerProfileRepositoryImpl,
		},
		{
			provide: CartShopRepository,
			useClass: CartShopRepoImpl,
		},
		TextileProductInfoProvider,
		SuperfoodProductInfoProvider,
		BoxProductInfoProvider,
		ProductInfoProviderRegistry,
		OwnerNameResolver,
		BoxCartContentResolver,
	],
	exports: [CartShopRepository, CartShopItemRepository],
})
export class CartShopModule {}

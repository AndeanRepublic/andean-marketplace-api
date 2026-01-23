import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartShopSchema } from './infra/persistence/cartShop.schema';
import { CartShopController } from './infra/controllers/cartShop.controller';
import { AddItemToCartUseCase } from './app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from './app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from './app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { RemoveItemFromCartUseCase } from './app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { ProductRepository } from './app/datastore/Product.repo';
import { ProductRepoImpl } from './infra/datastore/product.repo.impl';
import { CustomerProfileRepository } from './app/datastore/Customer.repo';
import { CustomerProfileRepositoryImpl } from './infra/datastore/customer.repo.impl';
import { CartShopRepository } from './app/datastore/CartShop.repo';
import { CartShopRepoImpl } from './infra/datastore/cartShop.repo.impl';
import { ProductsModule } from './product.module';
import { UsersModule } from './users.module';
import { CartItemSchema } from './infra/persistence/cartShopItem.schema';
import { CartShopItemRepository } from './app/datastore/CartShopItem.repo';
import { CartShopItemRepoImpl } from './infra/datastore/cartShopItem.repo.impl';
import { VariantModule } from './variant.module';
import { TextileProductModule } from './textileProduct.module';
import { SuperfoodModule } from './superfood.module';
import { UpdateCartItemQuantityUseCase } from './app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
// Product Info Providers (Strategy Pattern)
import { TextileProductInfoProvider } from './infra/services/products/TextileProductInfoProvider';
import { SuperfoodProductInfoProvider } from './infra/services/products/SuperfoodProductInfoProvider';
import { ProductInfoProviderRegistry } from './infra/services/products/ProductInfoProviderRegistry';
import { OwnerNameResolver } from './infra/services/OwnerNameResolver';

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
		ProductsModule,
		UsersModule,
		VariantModule,
		TextileProductModule,
		SuperfoodModule,
	],
	controllers: [CartShopController],
	providers: [
		// Use Cases
		AddItemToCartUseCase,
		CleanCartUseCase,
		GetCartByCustomerUseCase,
		RemoveItemFromCartUseCase,
		UpdateCartItemQuantityUseCase,
		// Repositories
		{
			provide: ProductRepository,
			useClass: ProductRepoImpl,
		},
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
		// Product Info Strategy Pattern
		TextileProductInfoProvider,
		SuperfoodProductInfoProvider,
		ProductInfoProviderRegistry,
		OwnerNameResolver,
	],
})
export class CartShopModule { }

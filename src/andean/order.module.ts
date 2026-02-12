import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './infra/persistence/order/order.schema';
import { OrderController } from './infra/controllers/order.controller';
import { CreateOrderUseCase } from './app/use_cases/orders/CreateOrderUseCase';
import { GetOrderByIdUseCase } from './app/use_cases/orders/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from './app/use_cases/orders/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from './app/use_cases/orders/UpdateOrderStatusUseCase';
import { OrderRepository } from './app/datastore/order/Order.repo';
import { OrderRepositoryImpl } from './infra/datastore/order/order.repo.impl';
import { UsersModule } from './users.module';
import { CartShopModule } from './cartShop.module';
import { VariantModule } from './variant.module';
import { ProductInfoProviderRegistry } from './infra/services/products/ProductInfoProviderRegistry';
import { TextileProductInfoProvider } from './infra/services/products/TextileProductInfoProvider';
import { SuperfoodProductInfoProvider } from './infra/services/products/SuperfoodProductInfoProvider';
import { TextileProductModule } from './textileProduct.module';
import { SuperfoodModule } from './superfood.module';
import { BoxModule } from './box.module';
import { CreateOrderFromCartUseCase } from './app/use_cases/orders/CreateOrderFromCartUseCase';
import { BoxProductInfoProvider } from './infra/services/products/BoxProductInfoProvider';
import { ReduceStockFromOrderUseCase } from './app/use_cases/orders/ReduceStockFromOrderUseCase';
import { TextileStockReducer } from './infra/services/stock/TextileStockReducer';
import { SuperfoodStockReducer } from './infra/services/stock/SuperfoodStockReducer';
import { BoxStockReducer } from './infra/services/stock/BoxStockReducer';
import { StockReducerRegistry } from './infra/services/stock/StockReducerRegistry';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Order',
				schema: OrderSchema,
			},
		]),
		UsersModule,
		CartShopModule,
		VariantModule,
		TextileProductModule,
		SuperfoodModule,
		BoxModule,
	],
	controllers: [OrderController],
	providers: [
		CreateOrderUseCase,
		CreateOrderFromCartUseCase,
		GetOrderByIdUseCase,
		GetOrdersByCustomerUseCase,
		UpdateOrderStatusUseCase,
		{
			provide: OrderRepository,
			useClass: OrderRepositoryImpl,
		},
		TextileProductInfoProvider,
		SuperfoodProductInfoProvider,
		BoxProductInfoProvider,
		ProductInfoProviderRegistry,
		TextileStockReducer,
		SuperfoodStockReducer,
		BoxStockReducer,
		StockReducerRegistry,
		ReduceStockFromOrderUseCase,
	],
	exports: [OrderRepository],
})
export class OrdersModule { }

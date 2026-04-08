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
import { GetAllOrdersUseCase } from './app/use_cases/orders/GetAllOrdersUseCase';
import { BoxProductInfoProvider } from './infra/services/products/BoxProductInfoProvider';
import { PayPalClientService } from './infra/services/paypal/PayPalClientService';
import { CreatePayPalOrderService } from './infra/services/paypal/CreatePayPalOrderService';
import { CapturePayPalOrderService } from './infra/services/paypal/CapturePayPalOrderService';
import { CreatePayPalOrderUseCase } from './app/use_cases/payments/CreatePayPalOrderUseCase';
import { CapturePayPalOrderUseCase } from './app/use_cases/payments/CapturePayPalOrderUseCase';
import { ReduceStockFromOrderUseCase } from './app/use_cases/orders/ReduceStockFromOrderUseCase';
import { TextileStockReducer } from './infra/services/stock/TextileStockReducer';
import { SuperfoodStockReducer } from './infra/services/stock/SuperfoodStockReducer';
import { BoxStockReducer } from './infra/services/stock/BoxStockReducer';
import { StockReducerRegistry } from './infra/services/stock/StockReducerRegistry';
import { IStockReducerRegistry } from './infra/services/stock/IStockReducerRegistry';
import { EmailRepository } from './app/datastore/Email.repo';
import { SesClientService } from './infra/services/email/SesClientService';
import { SesEmailRepoImpl } from './infra/datastore/email.repo.impl';
import { SendOrderConfirmationUseCase } from './app/use_cases/email/SendOrderConfirmationUseCase';

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
		GetAllOrdersUseCase,
		UpdateOrderStatusUseCase,
		{
			provide: OrderRepository,
			useClass: OrderRepositoryImpl,
		},
		TextileProductInfoProvider,
		SuperfoodProductInfoProvider,
		BoxProductInfoProvider,
		ProductInfoProviderRegistry,
		// PayPal Services
		PayPalClientService,
		CreatePayPalOrderService,
		CapturePayPalOrderService,
		// PayPal Use Cases
		CreatePayPalOrderUseCase,
		CapturePayPalOrderUseCase,
		TextileStockReducer,
		SuperfoodStockReducer,
		BoxStockReducer,
		StockReducerRegistry,
		{
			provide: IStockReducerRegistry,
			useExisting: StockReducerRegistry,
		},
		ReduceStockFromOrderUseCase,
		// Email Services
		SesClientService,
		SendOrderConfirmationUseCase,
		{
			provide: EmailRepository,
			useClass: SesEmailRepoImpl,
		},
	],
	exports: [OrderRepository],
})
export class OrdersModule {}

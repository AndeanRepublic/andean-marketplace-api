import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './infra/persistence/order.schema';
import { OrderController } from './infra/controllers/order.controller';
import { CreateOrderUseCase } from './app/use_cases/orders/CreateOrderUseCase';
import { GetOrderByIdUseCase } from './app/use_cases/orders/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from './app/use_cases/orders/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from './app/use_cases/orders/UpdateOrderStatusUseCase';
import { OrderRepository } from './app/datastore/Order.repo';
import { OrderRepositoryImpl } from './infra/datastore/order.repo.impl';
import { UserRepository } from './app/datastore/Customer.repo';
import { UserRepositoryImpl } from './infra/datastore/user.repo.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: `Order`,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersByCustomerUseCase,
    UpdateOrderStatusUseCase,
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class OrdersModule {}

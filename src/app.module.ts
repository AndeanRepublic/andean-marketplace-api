import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/users/auth.module';
import { ProductsModule } from './modules/users/product.module';
import { ShopsModule } from './modules/users/shop.module';
import { BankAccountsController } from './modules/users/bankAccount.module';
import { CartShopController } from './modules/users/infra/controllers/cartShop.controller';
import { OrdersModule } from './modules/users/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ShopsModule,
    BankAccountsController,
    CartShopController,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

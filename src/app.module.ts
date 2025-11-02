import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/users/auth.module';
import { ProductsModule } from './modules/users/product.module';
import { ShopsModule } from './modules/users/shop.module';
import { BankAccountsModule } from './modules/users/bankAccount.module';
import { OrdersModule } from './modules/users/order.module';
import { CartShopModule } from './modules/users/cartShop.module';

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
    BankAccountsModule,
    CartShopModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

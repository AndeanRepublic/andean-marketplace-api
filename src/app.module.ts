import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './andean/users.module';
import { AuthModule } from './andean/auth.module';
import { ShopsModule } from './andean/shop.module';
import { BankAccountsModule } from './andean/bankAccount.module';
import { OrdersModule } from './andean/order.module';
import { ShippingAddressModule } from './andean/shippingAddress.module';
import { CartShopModule } from './andean/cartShop.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './andean/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './andean/admin.module';
import { CommunityModule } from './andean/community.module';
import { OriginProductModule } from './andean/originProduct.module';
import { ProductTraceabilityModule } from './andean/productTraceability.module';
import { SuperfoodModule } from './andean/superfood.module';
import { MediaItemModule } from './andean/mediaItem.module';
import { TextileProductModule } from './andean/textileProduct.module';
import { VariantModule } from './andean/variant.module';
import { BoxModule } from './andean/box.module';
import { BoxSealModule } from './andean/boxSeal.module';

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
		MulterModule.register({
			dest: join(__dirname, '..', 'uploads'),
		}),
		ServeStaticModule.forRoot({
			rootPath: './uploads',
			serveRoot: '/public',
		}),
		UsersModule,
		AuthModule,
		ShopsModule,
		BankAccountsModule,
		CartShopModule,
		OrdersModule,
		ShippingAddressModule,
		UploadModule,
		AdminModule,
		CommunityModule,
		OriginProductModule,
		ProductTraceabilityModule,
		SuperfoodModule,
		MediaItemModule,
		TextileProductModule,
		VariantModule,
		BoxModule,
		BoxSealModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }

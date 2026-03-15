import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingAddressSchema } from './infra/persistence/shippingAddress.schema';
import { ShippingAddressController } from './infra/controllers/shippingAddress.controller';
import { CreateShippingAddressUseCase } from './app/use_cases/shipping/CreateShippingAddressUseCase';
import { GetShippingAddressesByCustomerUseCase } from './app/use_cases/shipping/GetShippingAddressesByCustomerUseCase';
import { UpdateShippingAddressUseCase } from './app/use_cases/shipping/UpdateShippingAddressUseCase';
import { DeleteShippingAddressUseCase } from './app/use_cases/shipping/DeleteShippingAddressUseCase';
import { SetDefaultShippingAddressUseCase } from './app/use_cases/shipping/SetDefaultShippingAddressUseCase';
import { GetShippingAddressByIdUseCase } from './app/use_cases/shipping/GetShippingAddressByIdUseCase';
import { ShippingAddressRepository } from './app/datastore/ShippingAddress.repo';
import { ShippingAddressRepositoryImpl } from './infra/datastore/shippingAddress.repo.impl';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'ShippingAddress',
				schema: ShippingAddressSchema,
			},
		]),
		UsersModule,
		AuthModule,
	],
	controllers: [ShippingAddressController],
	providers: [
		CreateShippingAddressUseCase,
		GetShippingAddressesByCustomerUseCase,
		GetShippingAddressByIdUseCase,
		UpdateShippingAddressUseCase,
		DeleteShippingAddressUseCase,
		SetDefaultShippingAddressUseCase,
		{
			provide: ShippingAddressRepository,
			useClass: ShippingAddressRepositoryImpl,
		},
	],
	exports: [ShippingAddressRepository],
})
export class ShippingAddressModule {}

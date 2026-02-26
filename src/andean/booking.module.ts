import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './infra/persistence/booking/booking.schema';
import { ExperiencePricesSchema } from './infra/persistence/experiences/experiencePrices.schema';
import { BookingController } from './infra/controllers/booking.controller';
import { CreateBookingUseCase } from './app/use_cases/bookings/CreateBookingUseCase';
import { CreatePayPalBookingOrderUseCase } from './app/use_cases/bookings/CreatePayPalBookingOrderUseCase';
import { CapturePayPalBookingUseCase } from './app/use_cases/bookings/CapturePayPalBookingUseCase';
import { GetBookingByIdUseCase } from './app/use_cases/bookings/GetBookingByIdUseCase';
import { GetBookingsByCustomerUseCase } from './app/use_cases/bookings/GetBookingsByCustomerUseCase';
import { GetBookingsByEmailUseCase } from './app/use_cases/bookings/GetBookingsByEmailUseCase';
import { UpdateBookingStatusUseCase } from './app/use_cases/bookings/UpdateBookingStatusUseCase';

import { UsersModule } from './users.module';
import { ExperienceModule } from './experience.module';
import { GetFutureUnavailableDatesUseCase } from './app/use_cases/experiences/GetFutureUnavailableDatesUseCase';
import { ExperienceRepository } from './app/datastore/experiences/Experience.repo';
import { ExperienceRepositoryImpl } from './infra/datastore/experiences/experience.repo.impl';
import { ExperiencePricesRepository } from './app/datastore/experiences/ExperiencePrices.repo';
import { ExperiencePricesRepositoryImpl } from './infra/datastore/experiences/experiencePrices.repo.impl';
import { PayPalClientService } from './infra/services/paypal/PayPalClientService';
import { CreatePayPalOrderService } from './infra/services/paypal/CreatePayPalOrderService';
import { CapturePayPalOrderService } from './infra/services/paypal/CapturePayPalOrderService';
import { BookingRepository } from './app/datastore/booking/Booking.repo';
import { BookingRepositoryImpl } from './infra/datastore/booking/booking.repo.impl';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Booking', schema: BookingSchema },
			{ name: 'ExperiencePrices', schema: ExperiencePricesSchema },
		]),
		UsersModule,
		ExperienceModule,
	],
	controllers: [BookingController],
	providers: [
		CreateBookingUseCase,
		CreatePayPalBookingOrderUseCase,
		CapturePayPalBookingUseCase,
		GetBookingByIdUseCase,
		GetBookingsByCustomerUseCase,
		GetBookingsByEmailUseCase,
		UpdateBookingStatusUseCase,
		GetFutureUnavailableDatesUseCase,
		PayPalClientService,
		CreatePayPalOrderService,
		CapturePayPalOrderService,
		{
			provide: BookingRepository,
			useClass: BookingRepositoryImpl,
		},
		{
			provide: ExperienceRepository,
			useClass: ExperienceRepositoryImpl,
		},
		{
			provide: ExperiencePricesRepository,
			useClass: ExperiencePricesRepositoryImpl,
		},
	],
	exports: [BookingRepository],
})
export class BookingModule {}

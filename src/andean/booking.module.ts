import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './infra/persistence/booking/booking.schema';
import { BookingController } from './infra/controllers/booking.controller';
import { CreateBookingUseCase } from './app/use_cases/bookings/CreateBookingUseCase';
import { GetBookingByIdUseCase } from './app/use_cases/bookings/GetBookingByIdUseCase';
import { GetBookingsByCustomerUseCase } from './app/use_cases/bookings/GetBookingsByCustomerUseCase';
import { GetBookingsByEmailUseCase } from './app/use_cases/bookings/GetBookingsByEmailUseCase';
import { UpdateBookingStatusUseCase } from './app/use_cases/bookings/UpdateBookingStatusUseCase';

import { UsersModule } from './users.module';
import { ExperienceModule } from './experience.module';
import { GetFutureUnavailableDatesUseCase } from './app/use_cases/experiences/GetFutureUnavailableDatesUseCase';
import { ExperienceRepository } from './app/datastore/experiences/Experience.repo';
import { ExperienceRepositoryImpl } from './infra/datastore/experiences/experience.repo.impl';
import { BookingRepository } from './app/datastore/booking/Booking.repo';
import { BookingRepositoryImpl } from './infra/datastore/booking/booking.repo.impl';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Booking',
				schema: BookingSchema,
			},
		]),
		UsersModule,
		ExperienceModule,
	],
	controllers: [BookingController],
	providers: [
		CreateBookingUseCase,
		GetBookingByIdUseCase,
		GetBookingsByCustomerUseCase,
		GetBookingsByEmailUseCase,
		UpdateBookingStatusUseCase,
		GetFutureUnavailableDatesUseCase,
		{
			provide: BookingRepository,
			useClass: BookingRepositoryImpl,
		},
		{
			provide: ExperienceRepository,
			useClass: ExperienceRepositoryImpl,
		},
	],
	exports: [BookingRepository],
})
export class BookingModule {}

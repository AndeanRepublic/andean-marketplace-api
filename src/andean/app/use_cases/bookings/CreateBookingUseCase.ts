import {
	Inject,
	Injectable,
	BadRequestException,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { CreateBookingDto } from '../../../infra/controllers/dto/booking/CreateBookingDto';
import { Booking } from '../../../domain/entities/booking/Booking';
import { BookingMapper } from '../../../infra/services/booking/BookingMapper';
import { GetAvailabilityModeByIdUseCase } from '../experiences/GetAvailabilityModeByIdUseCase';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';
import { GetFutureUnavailableDatesUseCase } from '../experiences/GetFutureUnavailableDatesUseCase';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';

@Injectable()
export class CreateBookingUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(GetAvailabilityModeByIdUseCase)
		private readonly getAvailabilityModeByIdUseCase: GetAvailabilityModeByIdUseCase,
		@Inject(GetFutureUnavailableDatesUseCase)
		private readonly getFutureUnavailableDatesUseCase: GetFutureUnavailableDatesUseCase,
	) {}

	async handle(dto: CreateBookingDto): Promise<Booking> {
		if (!dto.customerInfo.customerId && !dto.customerInfo.email) {
			throw new BadRequestException(
				'Either customerId or email must be present in customerInfo',
			);
		}

		// Validate experience
		const experience = await this.experienceRepository.getById(
			dto.experienceId,
		);
		if (!experience) {
			throw new NotFoundException('Experience not found');
		}

		// Validate availability mode
		const availabilityMode = await this.getAvailabilityModeByIdUseCase.handle(
			dto.experienceId,
		);
		if (!availabilityMode) {
			throw new NotFoundException('Availability mode not found');
		}

		// validate depending on the availability mode
		if (availabilityMode === ExperienceAvailabilityMode.EXCLUSIVE_GROUP) {
			await this.validateAvailability(dto, experience);
		} else if (
			availabilityMode === ExperienceAvailabilityMode.SHARED_CAPACITY
		) {
			await this.validateGuests(dto, experience);
		}

		const booking = BookingMapper.fromCreateDto(dto);
		return this.bookingRepository.createBooking(booking);
	}

	private async validateAvailability(
		dto: CreateBookingDto,
		experience: Experience,
	): Promise<void> {
		const startDate = new Date(dto.experienceDate);
		const days = experience.basicInfo.days;
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + days - 1);

		const unavailableDates = await this.getFutureUnavailableDatesUseCase.handle(
			dto.experienceId,
		);

		if (
			unavailableDates.some((date) => date.getTime() === startDate.getTime())
		) {
			throw new ConflictException(
				'the selected date is not available. There is already a booking for this experience in that period.',
			);
		}
	}

	private async validateGuests(
		dto: CreateBookingDto,
		experience: Experience,
	): Promise<void> {
		const totalGuestsReserved =
			await this.bookingRepository.getTotalGuestsReservedForDate(
				dto.experienceId,
				dto.experienceDate,
			);

		const maxCapacity = experience.basicInfo.maxNumberGroup;

		if (totalGuestsReserved + dto.guestsInfo.totalGuests > maxCapacity) {
			throw new ConflictException(
				'The experience has reached its maximum capacity',
			);
		}
	}
}

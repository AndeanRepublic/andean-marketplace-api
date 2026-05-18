import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Logger,
} from '@nestjs/common';
import { CapturePayPalOrderService } from '../../../infra/services/paypal/CapturePayPalOrderService';
import { CapturePayPalBookingDto } from '../../../infra/controllers/dto/booking/CapturePayPalBookingDto';
import { CreateBookingUseCase } from './CreateBookingUseCase';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { Booking } from '../../../domain/entities/booking/Booking';
import { EmailRepository } from '../../datastore/Email.repo';

export interface CapturePayPalBookingResponse {
	success: boolean;
	orderId: string;
	status: string;
	transactionId?: string;
	booking?: Booking;
}

@Injectable()
export class CapturePayPalBookingUseCase {
	private readonly logger = new Logger(CapturePayPalBookingUseCase.name);

	constructor(
		private readonly capturePayPalOrderService: CapturePayPalOrderService,
		private readonly createBookingUseCase: CreateBookingUseCase,
		private readonly emailRepository: EmailRepository,
	) {}

	async handle(
		dto: CapturePayPalBookingDto,
	): Promise<CapturePayPalBookingResponse> {
		const result = await this.capturePayPalOrderService.execute(dto.orderId);

		if (result.status !== 'COMPLETED') {
			return {
				success: false,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
			};
		}

		try {
			const bookingDto = {
				...dto,
				status: BookingStatus.CONFIRMED,
				payment: {
					...dto.payment,
					method: PaymentMethod.PAYPAL,
					provider: PaymentProvider.PAYPAL,
					status: PaymentStatus.PAID,
					providerTransactionId: result.transactionId,
					paidAt: new Date(),
				},
			};

			const booking = await this.createBookingUseCase.handle(bookingDto);

			// Fire-and-forget: enviar email de confirmación
			this.sendBookingConfirmationEmail(booking).catch((error) => {
				this.logger.error(
					`Failed to send booking confirmation email for booking #${booking.id}: ${error.message}`,
				);
			});

			return {
				success: true,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
				booking,
			};
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException(
				'Failed to create booking after PayPal capture',
			);
		}
	}

	private async sendBookingConfirmationEmail(booking: Booking): Promise<void> {
		const customerName = `${booking.customerInfo.firstName} ${booking.customerInfo.lastName}`;

		// Mapear age groups al formato de email
		const ageGroups = booking.guestsInfo.ageGroups.map((ageGroup) => {
			const pricingInfo = booking.experience.experienceSnapshot.ageGroupPricing.find(
				(pricing) => pricing.code === ageGroup.code,
			);

			const unitPrice = pricingInfo?.price || 0;
			const total = unitPrice * ageGroup.quantity;

			return {
				label: pricingInfo?.label || ageGroup.code,
				quantity: ageGroup.quantity,
				unitPrice,
				total,
			};
		});

		await this.emailRepository.sendBookingConfirmation({
			to: booking.customerInfo.email,
			data: {
				bookingNumber: booking.id,
				bookingDate: booking.createdAt,
				customerName,
				experienceName: booking.experience.experienceSnapshot.name,
				experienceDate: booking.experienceDate,
				days: booking.experience.experienceSnapshot.days,
				nights: booking.experience.experienceSnapshot.nights,
				ageGroups,
				totalGuests: booking.guestsInfo.totalGuests,
				pricing: {
					subtotal: booking.pricing.subtotal,
					total: booking.pricing.total,
				},
			},
		});
	}
}

import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CapturePayPalOrderService } from '../../../infra/services/paypal/CapturePayPalOrderService';
import { CapturePayPalBookingDto } from '../../../infra/controllers/dto/booking/CapturePayPalBookingDto';
import { CreateBookingUseCase } from './CreateBookingUseCase';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { Booking } from '../../../domain/entities/booking/Booking';

export interface CapturePayPalBookingResponse {
	success: boolean;
	orderId: string;
	status: string;
	transactionId?: string;
	booking?: Booking;
}

@Injectable()
export class CapturePayPalBookingUseCase {
	constructor(
		private readonly capturePayPalOrderService: CapturePayPalOrderService,
		private readonly createBookingUseCase: CreateBookingUseCase,
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
}

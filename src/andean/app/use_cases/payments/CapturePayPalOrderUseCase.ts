import { BadRequestException, Injectable } from '@nestjs/common';
import { CapturePayPalOrderService } from '../../../infra/services/paypal/CapturePayPalOrderService';
import { CapturePayPalOrderDto } from '../../../infra/controllers/dto/payment/CapturePayPalOrderDto';
import { CreateOrderFromCartUseCase } from '../orders/CreateOrderFromCartUseCase';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { CreateOrderFromCartDto } from 'src/andean/infra/controllers/dto/order/CreateOrderFromCartDto';

export interface CapturePayPalOrderResponse {
	success: boolean;
	orderId: string;
	status: string;
	transactionId?: string;
	order?: any;
}

@Injectable()
export class CapturePayPalOrderUseCase {
	constructor(
		private readonly capturePayPalOrderService: CapturePayPalOrderService,
		private readonly createOrderFromCartUseCase: CreateOrderFromCartUseCase,
	) {}

	async handle(
		dto: CapturePayPalOrderDto,
	): Promise<CapturePayPalOrderResponse> {
		const result = await this.capturePayPalOrderService.execute(dto.orderId);

		if (result.status !== 'COMPLETED') {
			return {
				success: false,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
			};
		}

		// If the payment was successful, create the order from the cart
		const orderDto: CreateOrderFromCartDto = {
			shippingInfo: dto.shippingInfo,
			payment: {
				method: PaymentMethod.PAYPAL,
				provider: PaymentProvider.PAYPAL,
				transactionId: result.transactionId ?? undefined,
				paidAt: new Date(),
			},
			currency: dto.currency,
			deliveryOption: dto.deliveryOption,
		};

		try {
			const order = await this.createOrderFromCartUseCase.handle(
				dto.customerId,
				dto.customerEmail,
				orderDto,
			);

			return {
				success: true,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
				order,
			};
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			if (error instanceof Error) {
				throw new BadRequestException(
					`Failed to create order from cart: ${error.message}`,
				);
			}
			throw new BadRequestException('Failed to create order from cart');
		}
	}
}

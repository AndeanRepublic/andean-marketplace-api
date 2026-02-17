import { Injectable } from '@nestjs/common';
import { CapturePayPalOrderService } from '../../../infra/services/paypal/CapturePayPalOrderService';
import { CapturePayPalOrderDto } from '../../../infra/controllers/dto/payment/CapturePayPalOrderDto';

export interface CapturePayPalOrderResponse {
	success: boolean;
	orderId: string;
	status: string;
	transactionId?: string;
}

@Injectable()
export class CapturePayPalOrderUseCase {
	constructor(
		private readonly capturePayPalOrderService: CapturePayPalOrderService,
	) {}

	async handle(
		dto: CapturePayPalOrderDto,
	): Promise<CapturePayPalOrderResponse> {
		const result = await this.capturePayPalOrderService.execute(dto.orderId);

		return {
			success: result.status === 'COMPLETED',
			orderId: result.orderId,
			status: result.status,
			transactionId: result.transactionId,
		};
	}
}

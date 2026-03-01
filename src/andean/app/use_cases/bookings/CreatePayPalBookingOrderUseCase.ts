import { Injectable } from '@nestjs/common';
import { CreatePayPalOrderService } from '../../../infra/services/paypal/CreatePayPalOrderService';
import { CreatePayPalBookingOrderDto } from '../../../infra/controllers/dto/booking/CreatePayPalBookingOrderDto';

@Injectable()
export class CreatePayPalBookingOrderUseCase {
	constructor(
		private readonly createPayPalOrderService: CreatePayPalOrderService,
	) {}

	async handle(dto: CreatePayPalBookingOrderDto): Promise<{ orderId: string }> {
		const orderId = await this.createPayPalOrderService.execute({
			amount: dto.amount,
			currency: dto.currency,
			items: dto.items?.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				unitAmount: {
					value: item.unitAmount.value,
					currencyCode: item.unitAmount.currencyCode,
				},
			})),
			returnPath: dto.returnPath ?? '/bookings/checkout/success',
			cancelPath: dto.cancelPath ?? '/bookings/checkout',
		});

		return { orderId };
	}
}

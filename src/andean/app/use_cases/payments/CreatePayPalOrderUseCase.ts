import { Injectable } from '@nestjs/common';
import { CreatePayPalOrderService } from '../../../infra/services/paypal/CreatePayPalOrderService';
import { CreatePayPalOrderDto } from '../../../infra/controllers/dto/payment/CreatePayPalOrderDto';

@Injectable()
export class CreatePayPalOrderUseCase {
	constructor(
		private readonly createPayPalOrderService: CreatePayPalOrderService,
	) {}

	async handle(dto: CreatePayPalOrderDto): Promise<{ orderId: string }> {
		const orderId = await this.createPayPalOrderService.execute({
			amount: dto.amount,
			currency: dto.currency,
			items: dto.items?.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				unit_amount: item.unit_amount,
			})),
		});

		return { orderId };
	}
}

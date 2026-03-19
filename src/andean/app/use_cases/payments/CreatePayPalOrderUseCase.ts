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
			deliveryOption: dto.deliveryOption,
			pricing: dto.pricing
				? {
						subtotal: dto.pricing.subtotal,
						discount: dto.pricing.discount,
						deliveryCost: dto.pricing.deliveryCost,
						taxOrFee: dto.pricing.taxOrFee,
						totalAmount: dto.pricing.totalAmount,
					}
				: undefined,
			items: dto.items?.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				unitAmount: item.unitAmount,
			})),
		});

		return { orderId };
	}
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import {
	EmailRepository,
	OrderDeliveredEmailData,
} from '../../datastore/Email.repo';
import { Order, ShippingInfo } from '../../../domain/entities/order/Order';

@Injectable()
export class SendOrderDeliveredUseCase {
	private readonly logger = new Logger(SendOrderDeliveredUseCase.name);

	constructor(
		@Inject(EmailRepository)
		private readonly emailRepository: EmailRepository,
	) {}

	async send(order: Order): Promise<void> {
		if (!order.customerEmail) {
			this.logger.warn(
				`Order ${order.id} has no customer email. Skipping delivered email.`,
			);
			return;
		}

		const data: OrderDeliveredEmailData = {
			orderNumber: order.id,
			customerName: order.shippingInfo.recipientName,
			deliveredAt: order.updatedAt,
			shippingAddress: this.formatShippingAddress(order.shippingInfo),
			items: (order.items ?? []).map((item) => ({
				name: item.name,
				quantity: item.quantity,
			})),
		};

		await this.emailRepository.sendOrderDelivered({
			to: order.customerEmail,
			data,
		});
	}

	private formatShippingAddress(info: ShippingInfo): string {
		const lines: string[] = [info.recipientName, info.addressLine1];

		if (info.addressLine2) {
			lines.push(info.addressLine2);
		}

		const cityParts: string[] = [];
		if (info.administrativeArea?.level2) {
			cityParts.push(info.administrativeArea.level2);
		}
		if (info.administrativeArea?.level1) {
			cityParts.push(info.administrativeArea.level1);
		}
		if (info.postalCode) {
			cityParts.push(info.postalCode);
		}
		if (cityParts.length) {
			lines.push(cityParts.join(', '));
		}

		lines.push(info.country);

		return lines.join('\n');
	}
}

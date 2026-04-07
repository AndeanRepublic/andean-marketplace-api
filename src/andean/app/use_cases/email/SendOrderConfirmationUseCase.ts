import { Inject, Injectable, Logger } from '@nestjs/common';
import {
	EmailRepository,
	OrderConfirmationEmailData,
} from '../../datastore/Email.repo';
import { Order, ShippingInfo } from '../../../domain/entities/order/Order';

@Injectable()
export class SendOrderConfirmationUseCase {
	private readonly logger = new Logger(SendOrderConfirmationUseCase.name);

	constructor(
		@Inject(EmailRepository)
		private readonly emailRepository: EmailRepository,
	) {}

	async send(order: Order): Promise<void> {
		if (!order.customerEmail) {
			this.logger.warn(
				`Order ${order.id} has no customer email. Skipping confirmation email.`,
			);
			return;
		}

		if (!order.items?.length) {
			this.logger.warn(
				`Order ${order.id} has no items. Skipping confirmation email.`,
			);
			return;
		}

		const data: OrderConfirmationEmailData = {
			orderNumber: order.id,
			orderDate: order.createdAt,
			customerName: order.shippingInfo.recipientName,
			items: order.items.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				total: item.totalPrice,
			})),
			summary: {
				subtotal: order.pricing.subtotal,
				shipping: order.pricing.deliveryCost,
				total: order.pricing.totalAmount,
			},
			shippingAddress: this.formatShippingAddress(order.shippingInfo),
		};

		await this.emailRepository.sendOrderConfirmation({
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

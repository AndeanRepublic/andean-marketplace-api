import { Order, OrderItem, OrderPricing, ShippingInfo, PaymentInfo } from '../../../domain/entities/order/Order';
import { OrderDocument } from '../../persistence/order/order.schema';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { Variant } from '../../../domain/entities/Variant';
import { TextileOptionName } from '../../../domain/enums/TextileOptionName';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class OrderMapper {
	static fromDocument(doc: OrderDocument): Order {
		const plain = doc.toObject();
		return plainToInstance(Order, {
			id: plain._id.toString(),
			customerId: plain.customerId,
			customerEmail: plain.customerEmail,
			status: plain.status,
			items: plain.items || [],
			pricing: plain.pricing,
			shippingInfo: plain.shippingInfo,
			payment: plain.payment,
			deliveryOption: plain.deliveryOption,
			createdAt: plain.createdAt,
			updatedAt: plain.updatedAt,
		});
	}

	static toPersistence(order: Order | Partial<Order>) {
		const plain = instanceToPlain(order);
		const { id, _id, __v, ...updateData } = plain;
		return {
			...updateData,
		};
	}

	/**
	 * Extrae atributos de variant (color, size, material) desde variant.combination
	 */
	static extractVariantAttributes(
		variant: Variant,
	): { color?: string; size?: string; material?: string } {
		const combination = variant.combination || {};
		return {
			color:
				combination[TextileOptionName.COLOR] ||
				combination[TextileOptionName.COLOR.toLowerCase()],
			size:
				combination[TextileOptionName.SIZE] ||
				combination[TextileOptionName.SIZE.toLowerCase()],
			material:
				combination[TextileOptionName.MATERIAL] ||
				combination[TextileOptionName.MATERIAL.toLowerCase()],
		};
	}
}

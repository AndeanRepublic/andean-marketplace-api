import {
	Order,
	OrderItem,
	OrderPricing,
	ShippingInfo,
	PaymentInfo,
} from '../../../domain/entities/order/Order';
import { OrderDocument } from '../../persistence/order/order.schema';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { Variant } from '../../../domain/entities/Variant';
import { TextileOptionName } from '../../../domain/enums/TextileOptionName';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateOrderDto } from '../../controllers/dto/order/CreateOrderDto';
import { Types } from 'mongoose';

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

	/**
	 * Crea una entidad Order desde CreateOrderDto
	 */
	static fromCreateDto(dto: CreateOrderDto): Order {
		const now = new Date();
		return new Order(
			new Types.ObjectId().toString(),
			dto.customerId,
			dto.customerEmail,
			dto.status || OrderStatus.PROCESSING,
			dto.items,
			dto.pricing,
			dto.shippingInfo,
			dto.payment,
			dto.deliveryOption ?? DeliveryOption.DHL,
			now,
			now,
		);
	}

	/**
	 * Crea una entidad Order desde datos del carrito
	 */
	static fromCartData(
		customerId: string | undefined,
		customerEmail: string | undefined,
		orderItems: OrderItem[],
		pricing: OrderPricing,
		shippingInfo: ShippingInfo,
		payment: PaymentInfo,
		deliveryOption?: DeliveryOption,
	): Order {
		const now = new Date();
		return new Order(
			new Types.ObjectId().toString(),
			customerId,
			customerEmail,
			OrderStatus.PROCESSING,
			orderItems,
			pricing,
			shippingInfo,
			payment,
			deliveryOption ?? DeliveryOption.DHL,
			now,
			now,
		);
	}

	static toPersistence(order: Order | Partial<Order>) {
		const plain = instanceToPlain(order);
		const { id: _id1, _id: _id2, __v: _v, ...updateData } = plain;
		return {
			...updateData,
		};
	}

	/**
	 * Extrae atributos de variant (color, size, material) desde variant.combination
	 */
	static extractVariantAttributes(variant: Variant): {
		color?: string;
		size?: string;
		material?: string;
	} {
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

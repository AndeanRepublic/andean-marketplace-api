import { Injectable, Inject } from '@nestjs/common';
import { OrderRepository } from '../../../app/datastore/order/Order.repo';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../../persistence/order/order.schema';
import { Order, OrderItem, OrderPricing, ShippingInfo, PaymentInfo } from '../../../domain/entities/order/Order';
import { Model } from 'mongoose';
import { OrderMapper } from '../../services/order/OrderMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartItem } from '../../../domain/entities/CartItem';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { ProductInfoProviderRegistry } from '../../services/products/ProductInfoProviderRegistry';
import { Types } from 'mongoose';
import { Variant } from 'src/andean/domain/entities/Variant';

@Injectable()
export class OrderRepositoryImpl extends OrderRepository {
	constructor(
		@InjectModel('Order')
		private readonly orderModel: Model<OrderDocument>,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		private readonly productInfoRegistry: ProductInfoProviderRegistry,
	) {
		super();
	}

	async getOrderById(id: string): Promise<Order | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.orderModel.findById(objectId).exec();
		return doc ? OrderMapper.fromDocument(doc) : null;
	}

	async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
		const docs = await this.orderModel.find({ customerId }).exec();
		return docs.map((doc) => OrderMapper.fromDocument(doc));
	}

	async getAllOrders(): Promise<Order[]> {
		const docs = await this.orderModel.find().sort({ createdAt: -1 }).exec();
		return docs.map((doc) => OrderMapper.fromDocument(doc));
	}

	async createOrder(order: Order): Promise<Order> {
		const plain = OrderMapper.toPersistence(order);
		const created = new this.orderModel({
			...plain,
		});
		const saved = await created.save();
		return OrderMapper.fromDocument(saved);
	}

	async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
		const plain = OrderMapper.toPersistence(order);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.orderModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return OrderMapper.fromDocument(updated!);
	}

	async changeOrderStatus(id: string, status: OrderStatus): Promise<Order> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.orderModel
			.findByIdAndUpdate(
				objectId,
				{ $set: { status, updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('Order not found');
		}
		return OrderMapper.fromDocument(updated);
	}

	async createOrderFromCart(
		cart: CartShop,
		cartItems: CartItem[],
		shippingInfo: ShippingInfo,
		payment: PaymentInfo,
		currency: string,
	): Promise<Order> {
		// Construir items de la orden desde cartItems
		const orderItems: OrderItem[] = await Promise.all(
			cartItems.map(async (cartItem) => {
				// Obtener variante si existe
				let variant: Variant | null = null;
				let color: string | undefined;
				let size: string | undefined;
				let material: string | undefined;

				if (cartItem.variantProductId) {
					variant = await this.variantRepository.getById(
						cartItem.variantProductId,
					);
					if (variant) {
						const attributes = OrderMapper.extractVariantAttributes(variant);
						color = attributes.color;
						size = attributes.size;
						material = attributes.material;
					}
				}

				// Obtener información del producto para el nombre
				const productInfo = await this.productInfoRegistry.getProductInfo(
					cartItem.productType,
					cartItem.productId,
				);

				// Calcular totalPrice
				const totalPrice =
					cartItem.unitPrice * cartItem.quantity - cartItem.discount;

				return {
					productId: cartItem.productId,
					color,
					size,
					material,
					productType: cartItem.productType,
					name: productInfo.title,
					sku: undefined, // SKU no está disponible en Variant actualmente
					quantity: cartItem.quantity,
					unitPrice: cartItem.unitPrice,
					discount: cartItem.discount,
					totalPrice,
				};
			}),
		);

		// Calcular pricing total
		const subtotal = orderItems.reduce(
			(sum, item) => sum + item.unitPrice * item.quantity,
			0,
		);
		const totalDiscount =
			cart.discount +
			orderItems.reduce((sum, item) => sum + item.discount, 0);
		const totalAmount =
			subtotal - totalDiscount + cart.deliveryCost + cart.taxOrFee;

		const pricing: OrderPricing = {
			subtotal,
			discount: totalDiscount,
			deliveryCost: cart.deliveryCost,
			taxOrFee: cart.taxOrFee,
			totalAmount,
			currency,
		};

		// Crear Order
		const now = new Date();
		const order = new Order(
			new Types.ObjectId().toString(),
			cart.customerId,
			cart.customerEmail,
			OrderStatus.PROCESSING,
			orderItems,
			pricing,
			shippingInfo,
			payment,
			DeliveryOption.DHL,
			now,
			now,
		);

		return this.createOrder(order);
	}
}

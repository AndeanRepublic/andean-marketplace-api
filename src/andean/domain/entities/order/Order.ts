import { OrderStatus } from '../../enums/OrderStatus';
import { ProductType } from '../../enums/ProductType';
import { PaymentMethod } from '../../enums/PaymentMethod';

/**
 * Item embebido dentro de una Order
 */
export interface OrderItem {
	productId: string;
	color?: string;
	size?: string;
	material?: string;
	productType: ProductType;
	name: string;
	sku?: string;
	quantity: number;
	unitPrice: number;
	discount: number;
	totalPrice: number;
}

/**
 * Información de área administrativa para shipping
 */
export interface AdministrativeArea {
	level1?: string; // state / province / department
	level2?: string;
	level3?: string;
}

/**
 * Información de envío
 */
export interface ShippingInfo {
	recipientName: string;
	phone: string;
	countryCode: string; // "PE", "US", "CA", etc
	country: string;
	city: string;
	administrativeArea: AdministrativeArea;
	addressLine1: string;
	addressLine2?: string;
	postalCode?: string;
}

/**
 * Información de pricing de la orden
 */
export interface OrderPricing {
	subtotal: number;
	discount: number;
	deliveryCost: number;
	taxOrFee: number;
	totalAmount: number;
	currency: string; // "USD", "PEN", "CAD", etc
}

/**
 * Información de pago
 */
export interface PaymentInfo {
	method: PaymentMethod;
	provider?: 'PAYPAL' | 'NIUBIZ' | 'MERCADOPAGO';
	transactionId?: string;
	paidAt?: Date;
}

/**
 * Order entity con items embebidos
 */
export class Order {
	constructor(
		public id: string,
		public customerId: string | undefined,
		public customerEmail: string | undefined,
		public status: OrderStatus,
		public items: OrderItem[],
		public pricing: OrderPricing,
		public shippingInfo: ShippingInfo,
		public payment: PaymentInfo,
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}

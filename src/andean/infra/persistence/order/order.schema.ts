import { Document, Schema } from 'mongoose';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { ProductType } from '../../../domain/enums/ProductType';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';

// Schema para OrderItem embebido
const OrderItemSchema = new Schema(
	{
		productId: { type: String, required: true },
		color: { type: String, required: false },
		size: { type: String, required: false },
		material: { type: String, required: false },
		productType: {
			type: String,
			enum: Object.values(ProductType),
			required: true,
		},
		name: { type: String, required: true },
		sku: { type: String, required: false },
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
		discount: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
	},
	{ _id: false },
);

// Schema para AdministrativeArea embebido
const AdministrativeAreaSchema = new Schema(
	{
		level1: { type: String, required: false },
		level2: { type: String, required: false },
		level3: { type: String, required: false },
	},
	{ _id: false },
);

// Schema para ShippingInfo embebido
const ShippingInfoSchema = new Schema(
	{
		recipientName: { type: String, required: true },
		phone: { type: String, required: true },
		countryCode: { type: String, required: true },
		country: { type: String, required: true },
		administrativeArea: { type: AdministrativeAreaSchema, required: true },
		addressLine1: { type: String, required: true },
		addressLine2: { type: String, required: false },
		postalCode: { type: String, required: false },
	},
	{ _id: false },
);

// Schema para OrderPricing embebido
const OrderPricingSchema = new Schema(
	{
		subtotal: { type: Number, required: true },
		discount: { type: Number, required: true },
		deliveryCost: { type: Number, required: true },
		taxOrFee: { type: Number, required: true },
		totalAmount: { type: Number, required: true },
		currency: { type: String, required: true },
	},
	{ _id: false },
);

// Schema para PaymentInfo embebido
const PaymentInfoSchema = new Schema(
	{
		method: {
			type: String,
			enum: Object.values(PaymentMethod),
			required: true,
		},
		provider: {
			type: String,
			enum: Object.values(PaymentProvider),
			required: false,
		},
		transactionId: { type: String, required: false },
		paidAt: { type: Date, required: false },
	},
	{ _id: false },
);

// Schema principal de Order
export const OrderSchema = new Schema({
	customerId: { type: String, required: false },
	customerEmail: { type: String, required: false },
	status: {
		type: String,
		enum: Object.values(OrderStatus),
		required: true,
	},
	items: { type: [OrderItemSchema], required: true },
	pricing: { type: OrderPricingSchema, required: true },
	shippingInfo: { type: ShippingInfoSchema, required: true },
	payment: { type: PaymentInfoSchema, required: true },
	deliveryOption: {
		type: String,
		enum: Object.values(DeliveryOption),
		required: false,
		default: DeliveryOption.DHL,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface OrderDocument extends Document {
	customerId?: string;
	customerEmail?: string;
	status: OrderStatus;
	items: Array<{
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
	}>;
	pricing: {
		subtotal: number;
		discount: number;
		deliveryCost: number;
		taxOrFee: number;
		totalAmount: number;
		currency: string;
	};
	shippingInfo: {
		recipientName: string;
		phone: string;
		countryCode: string;
		country: string;
		administrativeArea: {
			level1?: string;
			level2?: string;
			level3?: string;
		};
		addressLine1: string;
		addressLine2?: string;
		postalCode?: string;
	};
	payment: {
		method: PaymentMethod;
		provider?: PaymentProvider;
		transactionId?: string;
		paidAt?: Date;
	};
	deliveryOption?: DeliveryOption;
	createdAt: Date;
	updatedAt: Date;
}

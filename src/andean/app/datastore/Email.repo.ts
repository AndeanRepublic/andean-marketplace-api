export interface OrderConfirmationEmailData {
	orderNumber: string;
	orderDate: Date;
	customerName: string;
	items: Array<{
		name: string;
		quantity: number;
		unitPrice: number;
		total: number;
	}>;
	summary: {
		subtotal: number;
		shipping: number;
		total: number;
	};
	shippingAddress: string;
}

export interface SendOrderConfirmationPayload {
	to: string;
	cc?: string[];
	data: OrderConfirmationEmailData;
}

export interface OrderDeliveredEmailData {
	orderNumber: string;
	customerName: string;
	deliveredAt: Date;
	shippingAddress: string;
	items: Array<{
		name: string;
		quantity: number;
	}>;
}

export interface SendOrderDeliveredPayload {
	to: string;
	cc?: string[];
	data: OrderDeliveredEmailData;
}

export interface PasswordResetEmailData {
	code: string;
}

export interface SendPasswordResetPayload {
	to: string;
	data: PasswordResetEmailData;
}

export interface BookingConfirmationEmailData {
	bookingNumber: string;
	bookingDate: Date;
	customerName: string;
	experienceName: string;
	experienceDate: Date;
	days: number;
	nights: number;
	ageGroups: Array<{
		label: string;
		quantity: number;
		unitPrice: number;
		total: number;
	}>;
	totalGuests: number;
	pricing: {
		subtotal: number;
		total: number;
	};
}

export interface SendBookingConfirmationPayload {
	to: string;
	cc?: string[];
	data: BookingConfirmationEmailData;
}

export interface SellerApplicationDecisionEmailData {
	decision: 'APPROVED' | 'REJECTED';
	customerName: string;
	shopName: string;
	rejectionReason?: string;
}

export interface SendSellerApplicationDecisionPayload {
	to: string;
	data: SellerApplicationDecisionEmailData;
}

export abstract class EmailRepository {
	abstract sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void>;
	abstract sendOrderDelivered(payload: SendOrderDeliveredPayload): Promise<void>;
	abstract sendPasswordReset(payload: SendPasswordResetPayload): Promise<void>;
	abstract sendBookingConfirmation(
		payload: SendBookingConfirmationPayload,
	): Promise<void>;
	abstract sendSellerApplicationDecision(
		payload: SendSellerApplicationDecisionPayload,
	): Promise<void>;
}

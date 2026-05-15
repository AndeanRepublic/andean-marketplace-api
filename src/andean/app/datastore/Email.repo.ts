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

export abstract class EmailRepository {
	abstract sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void>;
	abstract sendPasswordReset(payload: SendPasswordResetPayload): Promise<void>;
	abstract sendBookingConfirmation(
		payload: SendBookingConfirmationPayload,
	): Promise<void>;
}

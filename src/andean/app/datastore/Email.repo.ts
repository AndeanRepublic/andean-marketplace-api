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
	data: OrderConfirmationEmailData;
}

export interface PasswordResetEmailData {
	code: string;
}

export interface SendPasswordResetPayload {
	to: string;
	data: PasswordResetEmailData;
}

export abstract class EmailRepository {
	abstract sendOrderConfirmation(
		payload: SendOrderConfirmationPayload,
	): Promise<void>;
	abstract sendPasswordReset(payload: SendPasswordResetPayload): Promise<void>;
}

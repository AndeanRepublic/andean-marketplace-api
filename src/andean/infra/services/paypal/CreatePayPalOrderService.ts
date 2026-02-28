import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import * as paypal from '@paypal/checkout-server-sdk';
import {
	OrdersController,
	CheckoutPaymentIntent,
	OrderApplicationContextLandingPage,
	OrderApplicationContextUserAction,
} from '@paypal/paypal-server-sdk';
import { PayPalClientService } from './PayPalClientService';

export interface CreatePayPalOrderRequest {
	amount: number;
	currency: string;
	items?: Array<{
		name: string;
		quantity: number;
		unitAmount: {
			value: string;
			currencyCode: string;
		};
	}>;
	returnPath?: string;
	cancelPath?: string;
}

@Injectable()
export class CreatePayPalOrderService {
	private readonly logger = new Logger(CreatePayPalOrderService.name);

	constructor(private readonly paypalClientService: PayPalClientService) {}

	async execute(requestData: CreatePayPalOrderRequest): Promise<string> {
		try {
			// Validar datos
			if (!requestData.amount || requestData.amount <= 0) {
				throw new BadRequestException('Amount must be greater than 0');
			}

			if (!requestData.currency) {
				throw new BadRequestException('Currency is required');
			}

			const client = this.paypalClientService.getClient();

			// Crear estructura de request
			const ordersController = new OrdersController(client);
			const items = requestData.items?.map((item) => ({
				name: item.name,
				quantity: item.quantity.toString(),
				unitAmount: {
					value: item.unitAmount.value.toString(),
					currencyCode: item.unitAmount.currencyCode,
				},
			}));
			const collect = {
				body: {
					intent: CheckoutPaymentIntent.Capture,
					purchaseUnits: [
						{
							amount: {
								currencyCode: requestData.currency,
								value: requestData.amount.toFixed(2),
								...(requestData.items && requestData.items.length > 0
									? {
											breakdown: {
												itemTotal: {
													currencyCode: requestData.currency,
													value: requestData.amount.toFixed(2),
												},
											},
										}
									: {}),
							},
							...(items && items.length > 0 ? { items } : {}),
						},
					],
					applicationContext: {
						brandName: 'Andean Republic',
						landingPage: OrderApplicationContextLandingPage.NoPreference,
						userAction: OrderApplicationContextUserAction.PayNow,
						returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}${requestData.returnPath ?? '/checkout/success'}`,
						cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}${requestData.cancelPath ?? '/checkout'}`,
					},
				},
				prefer: 'return=representation',
			};

			// Ejecutar la petición
			const response = await ordersController.createOrder(collect);

			if (response.statusCode !== 201) {
				throw new Error(`PayPal API returned status ${response.statusCode}`);
			}

			const orderId = response.result.id;
			if (!orderId) {
				throw new Error('Order ID is not found');
			}

			this.logger.log(`PayPal order created successfully: ${orderId}`);

			return orderId;
		} catch (error) {
			this.logger.error('Failed to create PayPal order', error);
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new Error(
				`Failed to create PayPal order: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}
}

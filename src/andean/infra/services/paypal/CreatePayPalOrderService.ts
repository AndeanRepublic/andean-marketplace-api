import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { PayPalClientService } from './PayPalClientService';

export interface CreatePayPalOrderRequest {
	amount: number;
	currency: string;
	items?: Array<{
		name: string;
		quantity: number;
		unit_amount: {
			value: string;
			currency_code: string;
		};
	}>;
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
			const paypalRequest = new paypal.orders.OrdersCreateRequest();
			paypalRequest.prefer('return=representation');
			paypalRequest.requestBody({
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: {
							currency_code: requestData.currency,
							value: requestData.amount.toFixed(2),
							...(requestData.items && requestData.items.length > 0
								? {
										breakdown: {
											item_total: {
												currency_code: requestData.currency,
												value: requestData.amount.toFixed(2),
											},
										},
									}
								: {}),
						},
						...(requestData.items && requestData.items.length > 0
							? { items: requestData.items }
							: {}),
					},
				],
				application_context: {
					brand_name: 'Andean Republic',
					landing_page: 'NO_PREFERENCE',
					user_action: 'PAY_NOW',
					return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success`,
					cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
				},
			});

			// Ejecutar la petición
			const response = await client.execute(paypalRequest);

			if (response.statusCode !== 201) {
				throw new Error(`PayPal API returned status ${response.statusCode}`);
			}

			const orderId = response.result.id;
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

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { PayPalClientService } from './PayPalClientService';

export interface CapturePayPalOrderResponse {
	orderId: string;
	status: string;
	transactionId?: string;
	payer?: {
		name?: {
			given_name?: string;
			surname?: string;
		};
		email_address?: string;
	};
	purchase_units?: Array<{
		payments?: {
			captures?: Array<{
				id?: string;
				status?: string;
				amount?: {
					value?: string;
					currency_code?: string;
				};
			}>;
		};
	}>;
}

@Injectable()
export class CapturePayPalOrderService {
	private readonly logger = new Logger(CapturePayPalOrderService.name);

	constructor(private readonly paypalClientService: PayPalClientService) {}

	async execute(orderId: string): Promise<CapturePayPalOrderResponse> {
		try {
			if (!orderId) {
				throw new BadRequestException('Order ID is required');
			}

			const client = this.paypalClientService.getClient();

			// Crear request de capture
			const request = new paypal.orders.OrdersCaptureRequest(orderId);
			request.requestBody({});

			// Ejecutar la petición
			const response = await client.execute(request);

			if (response.statusCode !== 201) {
				throw new Error(`PayPal API returned status ${response.statusCode}`);
			}

			const result = response.result;

			// Validar que el estado sea COMPLETED
			if (result.status !== 'COMPLETED') {
				this.logger.warn(
					`PayPal order ${orderId} status is ${result.status}, expected COMPLETED`,
				);
			}

			// Extraer transaction ID del primer capture
			const transactionId =
				result.purchase_units?.[0]?.payments?.captures?.[0]?.id;

			this.logger.log(
				`PayPal order captured successfully: ${orderId}, transaction: ${transactionId}`,
			);

			return {
				orderId: result.id,
				status: result.status,
				transactionId,
				payer: result.payer,
				purchase_units: result.purchase_units,
			};
		} catch (error) {
			this.logger.error('Failed to capture PayPal order', error);
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new Error(
				`Failed to capture PayPal order: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}
}

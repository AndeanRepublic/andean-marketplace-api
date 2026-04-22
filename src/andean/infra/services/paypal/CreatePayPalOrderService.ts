import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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
	deliveryOption?: string;
	pricing?: {
		subtotal: number;
		discount: number;
		deliveryCost: number;
		taxOrFee: number;
		totalAmount: number;
	};
	returnPath?: string;
	cancelPath?: string;
}
const DELIVERY_COSTS: Record<string, number> = {
	DHL: 15,
};
@Injectable()
export class CreatePayPalOrderService {
	private readonly logger = new Logger(CreatePayPalOrderService.name);
	constructor(private readonly paypalClientService: PayPalClientService) {}
	async execute(requestData: CreatePayPalOrderRequest): Promise<string> {
		try {
			if (!requestData.currency) {
				throw new BadRequestException('Currency is required');
			}
			const client = this.paypalClientService.getClient();
			const ordersController = new OrdersController(client);
			const hasItems = requestData.items && requestData.items.length > 0;
			const items = requestData.items?.map((item) => ({
				name: item.name,
				quantity: item.quantity.toString(),
				unitAmount: {
					value: Number(item.unitAmount.value).toFixed(2),
					currencyCode: item.unitAmount.currencyCode,
				},
			}));
			// Calcular breakdown desde pricing si viene, sino desde amount/deliveryOption
			let amountValue: string;
			let breakdown:
				| {
						itemTotal: { currencyCode: string; value: string };
						shipping?: { currencyCode: string; value: string };
						taxTotal?: { currencyCode: string; value: string };
						discount?: { currencyCode: string; value: string };
				  }
				| undefined;
			if (requestData.pricing) {
				const { subtotal, discount, deliveryCost, taxOrFee, totalAmount } =
					requestData.pricing;
				amountValue = totalAmount.toFixed(2);
				if (hasItems) {
					breakdown = {
						itemTotal: {
							currencyCode: requestData.currency,
							value: subtotal.toFixed(2),
						},
						...(deliveryCost > 0 && {
							shipping: {
								currencyCode: requestData.currency,
								value: deliveryCost.toFixed(2),
							},
						}),
						...(taxOrFee > 0 && {
							taxTotal: {
								currencyCode: requestData.currency,
								value: taxOrFee.toFixed(2),
							},
						}),
						...(discount > 0 && {
							discount: {
								currencyCode: requestData.currency,
								value: discount.toFixed(2),
							},
						}),
					};
				}
			} else {
				// Fallback: derivar shipping desde deliveryOption
				const normalizedOption =
					requestData.deliveryOption?.toUpperCase() ?? '';
				const shippingCost = DELIVERY_COSTS[normalizedOption] ?? 0;
				const itemTotal = hasItems
					? (requestData.items ?? []).reduce(
							(sum, item) =>
								sum + Number(item.unitAmount.value) * item.quantity,
							0,
						)
					: requestData.amount - shippingCost;
				amountValue = (itemTotal + shippingCost).toFixed(2);
				if (hasItems) {
					breakdown = {
						itemTotal: {
							currencyCode: requestData.currency,
							value: itemTotal.toFixed(2),
						},
						...(shippingCost > 0 && {
							shipping: {
								currencyCode: requestData.currency,
								value: shippingCost.toFixed(2),
							},
						}),
					};
				}
			}
			if (Number(amountValue) <= 0) {
				throw new BadRequestException('Amount must be greater than 0');
			}
			const collect = {
				body: {
					intent: CheckoutPaymentIntent.Capture,
					purchaseUnits: [
						{
							amount: {
								currencyCode: requestData.currency,
								value: amountValue,
								...(breakdown && { breakdown }),
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

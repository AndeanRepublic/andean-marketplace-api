import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CapturePayPalOrderService } from '../../../infra/services/paypal/CapturePayPalOrderService';
import { CapturePayPalOrderDto } from '../../../infra/controllers/dto/payment/CapturePayPalOrderDto';
import { CreateOrderFromCartUseCase } from '../orders/CreateOrderFromCartUseCase';
import { CreateOrderUseCase } from '../orders/CreateOrderUseCase';
import { ReduceStockFromOrderUseCase } from '../orders/ReduceStockFromOrderUseCase';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { ProductType } from '../../../domain/enums/ProductType';
import { CreateOrderFromCartDto } from '../../../infra/controllers/dto/order/CreateOrderFromCartDto';
import { CreateOrderDto } from '../../../infra/controllers/dto/order/CreateOrderDto';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';
import { SendOrderConfirmationUseCase } from '../email/SendOrderConfirmationUseCase';

export interface CapturePayPalOrderResponse {
	success: boolean;
	orderId: string;
	status: string;
	transactionId?: string;
	order?: any;
}

@Injectable()
export class CapturePayPalOrderUseCase {
	private readonly logger = new Logger(CapturePayPalOrderUseCase.name);

	constructor(
		private readonly capturePayPalOrderService: CapturePayPalOrderService,
		private readonly createOrderFromCartUseCase: CreateOrderFromCartUseCase,
		private readonly createOrderUseCase: CreateOrderUseCase,
		private readonly reduceStockFromOrderUseCase: ReduceStockFromOrderUseCase,
		private readonly sendOrderConfirmationUseCase: SendOrderConfirmationUseCase,
	) {}

	async handle(
		dto: CapturePayPalOrderDto,
	): Promise<CapturePayPalOrderResponse> {
		const result = await this.capturePayPalOrderService.execute(dto.orderId);

		if (result.status !== 'COMPLETED') {
			return {
				success: false,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
			};
		}

		const paymentInfo = {
			method: PaymentMethod.PAYPAL as const,
			provider: PaymentProvider.PAYPAL,
			transactionId: result.transactionId ?? undefined,
			paidAt: new Date(),
		};

		try {
			let order;

			if (dto.customerId) {
				// Logged-in user: create order from cart
				const orderDto: CreateOrderFromCartDto = {
					shippingInfo: dto.shippingInfo,
					payment: paymentInfo,
					currency: dto.currency,
					deliveryOption: dto.deliveryOption,
				};
				order = await this.createOrderFromCartUseCase.handle(
					dto.customerId,
					orderDto,
				);
			} else if (dto.customerEmail && dto.items && dto.pricing) {
				// Guest: create order from payload
				if (!dto.items.length) {
					throw new BadRequestException(
						'Guest checkout requires at least one item',
					);
				}
				// Validate variantId for TEXTILE products
				for (const item of dto.items) {
					if (item.productType === ProductType.TEXTILE && !item.variantId) {
						throw new BadRequestException(
							`variantId is required for TEXTILE product ${item.productId}`,
						);
					}
				}
				await this.reduceStockFromOrderUseCase.handleFromOrderItems(
					dto.items.map((i) => ({
						variantId: i.variantId,
						productType: i.productType,
						productId: i.productId,
						quantity: i.quantity,
					})),
				);
				const createOrderDto: CreateOrderDto = {
					customerEmail: dto.customerEmail,
					status: OrderStatus.PROCESSING,
					items: dto.items,
					pricing: dto.pricing,
					shippingInfo: dto.shippingInfo,
					payment: paymentInfo,
					deliveryOption: dto.deliveryOption ?? DeliveryOption.DHL,
				};
				order = await this.createOrderUseCase.handle(createOrderDto);
			} else {
				throw new BadRequestException(
					'Either customerId (for cart) or customerEmail with items and pricing (for guest) must be provided',
				);
			}

			// Fire-and-forget: send confirmation email without blocking the response
			this.sendOrderConfirmationUseCase
				.send(order)
				.catch((err) =>
					this.logger.error(
						`Failed to send order confirmation email for order ${order?.id}`,
						err instanceof Error ? err.stack : String(err),
					),
				);

			return {
				success: true,
				orderId: result.orderId,
				status: result.status,
				transactionId: result.transactionId,
				order,
			};
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			if (error instanceof Error) {
				throw new BadRequestException(
					`Failed to create order: ${error.message}`,
				);
			}
			throw new BadRequestException('Failed to create order');
		}
	}
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { ProductType } from '../../../domain/enums/ProductType';
import { DeliveryOption } from '../../../domain/enums/DeliveryOption';

export class AdministrativeAreaResponse {
	@ApiPropertyOptional({ description: 'Nivel 1 (departamento/estado)', example: 'Lima' })
	level1?: string;

	@ApiPropertyOptional({ description: 'Nivel 2 (provincia)', example: 'Lima' })
	level2?: string;

	@ApiPropertyOptional({ description: 'Nivel 3 (distrito)', example: 'Miraflores' })
	level3?: string;
}

export class ShippingInfoResponse {
	@ApiProperty({ description: 'Nombre del destinatario', example: 'Juan Pérez' })
	recipientName!: string;

	@ApiProperty({ description: 'Teléfono', example: '+51987654321' })
	phone!: string;

	@ApiProperty({ description: 'Código de país', example: 'PE' })
	countryCode!: string;

	@ApiProperty({ description: 'País', example: 'Perú' })
	country!: string;

	@ApiProperty({ description: 'Ciudad', example: 'Lima' })
	city!: string;

	@ApiProperty({ description: 'Área administrativa', type: AdministrativeAreaResponse })
	administrativeArea!: AdministrativeAreaResponse;

	@ApiProperty({ description: 'Dirección línea 1', example: 'Av. Larco 1234' })
	addressLine1!: string;

	@ApiPropertyOptional({ description: 'Dirección línea 2', example: 'Dpto 302' })
	addressLine2?: string;

	@ApiPropertyOptional({ description: 'Código postal', example: '15074' })
	postalCode?: string;
}

export class OrderItemResponse {
	@ApiProperty({ description: 'ID del producto', example: '507f1f77bcf86cd799439012' })
	productId!: string;

	@ApiPropertyOptional({ description: 'Color', example: 'Azul' })
	color?: string;

	@ApiPropertyOptional({ description: 'Talla', example: 'M' })
	size?: string;

	@ApiPropertyOptional({ description: 'Material', example: 'Alpaca' })
	material?: string;

	@ApiProperty({ description: 'Tipo de producto', enum: ProductType, example: ProductType.TEXTILE })
	productType!: ProductType;

	@ApiProperty({ description: 'Nombre del producto', example: 'Poncho Andino' })
	name!: string;

	@ApiPropertyOptional({ description: 'SKU', example: 'PON-ALP-BLU-M' })
	sku?: string;

	@ApiProperty({ description: 'Cantidad', example: 2 })
	quantity!: number;

	@ApiProperty({ description: 'Precio unitario', example: 50.00 })
	unitPrice!: number;

	@ApiProperty({ description: 'Descuento', example: 5.00 })
	discount!: number;

	@ApiProperty({ description: 'Precio total', example: 95.00 })
	totalPrice!: number;
}

export class OrderPricingResponse {
	@ApiProperty({ description: 'Subtotal', example: 100.00 })
	subtotal!: number;

	@ApiProperty({ description: 'Descuento total', example: 5.00 })
	discount!: number;

	@ApiProperty({ description: 'Costo de envío', example: 15.00 })
	deliveryCost!: number;

	@ApiProperty({ description: 'Impuestos o tarifas', example: 10.00 })
	taxOrFee!: number;

	@ApiProperty({ description: 'Monto total', example: 120.00 })
	totalAmount!: number;

	@ApiProperty({ description: 'Moneda', example: 'USD' })
	currency!: string;
}

export class PaymentInfoResponse {
	@ApiProperty({ description: 'Método de pago', enum: PaymentMethod, example: PaymentMethod.PAYPAL })
	method!: PaymentMethod;

	@ApiPropertyOptional({ description: 'Proveedor de pago', enum: PaymentProvider, example: PaymentProvider.PAYPAL })
	provider?: PaymentProvider;

	@ApiPropertyOptional({ description: 'ID de transacción', example: 'TXN123456789' })
	transactionId?: string;

	@ApiPropertyOptional({ description: 'Fecha de pago', example: '2026-02-10T10:30:00Z' })
	paidAt?: Date;
}

export class OrderResponse {
	@ApiProperty({ description: 'ID de la orden', example: '507f1f77bcf86cd799439011' })
	id!: string;

	@ApiPropertyOptional({ description: 'ID del cliente', example: '507f191e810c19729de860ea' })
	customerId?: string;

	@ApiPropertyOptional({ description: 'Email del cliente', example: 'customer@example.com' })
	customerEmail?: string;

	@ApiProperty({ description: 'Estado de la orden', enum: OrderStatus, example: OrderStatus.PROCESSING })
	status!: OrderStatus;

	@ApiProperty({ description: 'Items de la orden', type: [OrderItemResponse] })
	items!: OrderItemResponse[];

	@ApiProperty({ description: 'Información de precios', type: OrderPricingResponse })
	pricing!: OrderPricingResponse;

	@ApiProperty({ description: 'Información de envío', type: ShippingInfoResponse })
	shippingInfo!: ShippingInfoResponse;

	@ApiProperty({ description: 'Información de pago', type: PaymentInfoResponse })
	payment!: PaymentInfoResponse;

	@ApiPropertyOptional({ description: 'Opción de entrega', enum: DeliveryOption, example: DeliveryOption.DHL })
	deliveryOption?: DeliveryOption;

	@ApiProperty({ description: 'Fecha de creación', example: '2026-02-10T10:00:00Z' })
	createdAt!: Date;

	@ApiProperty({ description: 'Fecha de actualización', example: '2026-02-10T10:30:00Z' })
	updatedAt!: Date;
}

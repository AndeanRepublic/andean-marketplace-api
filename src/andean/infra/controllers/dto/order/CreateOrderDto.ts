import {
	IsString,
	IsOptional,
	IsEnum,
	IsArray,
	ArrayNotEmpty,
	IsNumber,
	Min,
	IsObject,
	ValidateNested,
	IsEmail,
	IsDate,
	IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/andean/domain/enums/OrderStatus';
import { PaymentMethod } from 'src/andean/domain/enums/PaymentMethod';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { DeliveryOption } from 'src/andean/domain/enums/DeliveryOption';
import { PaymentProvider } from 'src/andean/domain/enums/PaymentProvider';
import {
	OrderItem,
	OrderPricing,
	ShippingInfo,
	PaymentInfo,
	AdministrativeArea,
} from 'src/andean/domain/entities/order/Order';

// DTOs para objetos embebidos
export class AdministrativeAreaDto implements AdministrativeArea {
	@ApiPropertyOptional({ description: 'Level 1 (state/province/department)' })
	@IsString()
	@IsOptional()
	level1?: string;

	@ApiPropertyOptional({ description: 'Level 2' })
	@IsString()
	@IsOptional()
	level2?: string;

	@ApiPropertyOptional({ description: 'Level 3' })
	@IsString()
	@IsOptional()
	level3?: string;
}

export class ShippingInfoDto implements ShippingInfo {
	@ApiProperty({ description: 'Nombre del destinatario' })
	@IsString()
	@IsNotEmpty()
	recipientName!: string;

	@ApiProperty({ description: 'Teléfono del destinatario' })
	@IsString()
	@IsNotEmpty()
	phone!: string;

	@ApiProperty({
		description: 'Código de país (PE, US, CA, etc)',
		example: 'PE',
	})
	@IsString()
	@IsNotEmpty()
	countryCode!: string;

	@ApiProperty({ description: 'Nombre del país' })
	@IsString()
	@IsNotEmpty()
	country!: string;

	@ApiProperty({ type: AdministrativeAreaDto })
	@ValidateNested()
	@Type(() => AdministrativeAreaDto)
	@IsObject()
	administrativeArea!: AdministrativeAreaDto;

	@ApiProperty({ description: 'Dirección línea 1' })
	@IsString()
	@IsNotEmpty()
	addressLine1!: string;

	@ApiPropertyOptional({ description: 'Dirección línea 2' })
	@IsString()
	@IsOptional()
	addressLine2?: string;

	@ApiPropertyOptional({ description: 'Código postal' })
	@IsString()
	@IsOptional()
	postalCode?: string;
}

export class OrderItemDto implements OrderItem {
	@ApiProperty({ description: 'ID del producto' })
	@IsString()
	@IsNotEmpty()
	productId!: string;

	@ApiPropertyOptional({
		description: 'ID de la variante (requerido para productos con variantes en guest checkout)',
	})
	@IsString()
	@IsOptional()
	variantId?: string;

	@ApiPropertyOptional({ description: 'Color del producto' })
	@IsString()
	@IsOptional()
	color?: string;

	@ApiPropertyOptional({ description: 'Talla del producto' })
	@IsString()
	@IsOptional()
	size?: string;

	@ApiPropertyOptional({ description: 'Material del producto' })
	@IsString()
	@IsOptional()
	material?: string;

	@ApiProperty({ enum: ProductType, description: 'Tipo de producto' })
	@IsEnum(ProductType)
	@IsNotEmpty()
	productType!: ProductType;

	@ApiProperty({ description: 'Nombre del producto' })
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiPropertyOptional({ description: 'SKU del producto' })
	@IsString()
	@IsOptional()
	sku?: string;

	@ApiProperty({ description: 'Cantidad', minimum: 1 })
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Precio unitario', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	unitPrice!: number;

	@ApiProperty({ description: 'Descuento aplicado', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	discount!: number;

	@ApiProperty({
		description: 'Precio total (unitPrice * quantity - discount)',
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	totalPrice!: number;
}

export class OrderPricingDto implements OrderPricing {
	@ApiProperty({ description: 'Subtotal', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	subtotal!: number;

	@ApiProperty({ description: 'Descuento total', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	discount!: number;

	@ApiProperty({ description: 'Costo de envío', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	deliveryCost!: number;

	@ApiProperty({ description: 'Impuestos o tarifas', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	taxOrFee!: number;

	@ApiProperty({ description: 'Monto total', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	totalAmount!: number;

	@ApiProperty({ description: 'Moneda (USD, PEN, CAD, etc)', example: 'USD' })
	@IsString()
	@IsNotEmpty()
	currency!: string;
}

export class PaymentInfoDto implements PaymentInfo {
	@ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
	@IsEnum(PaymentMethod)
	@IsNotEmpty()
	method!: PaymentMethod;

	@ApiPropertyOptional({
		enum: PaymentProvider,
		description: 'Proveedor de pago',
	})
	@IsEnum(PaymentProvider)
	@IsOptional()
	provider?: PaymentProvider;

	@ApiPropertyOptional({ description: 'ID de transacción' })
	@IsString()
	@IsOptional()
	transactionId?: string;

	@ApiPropertyOptional({ description: 'Fecha de pago' })
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	paidAt?: Date;
}

export class CreateOrderDto {
	@ApiPropertyOptional({ description: 'ID del cliente (si está logueado)' })
	@IsString()
	@IsOptional()
	customerId?: string;

	@ApiPropertyOptional({
		description: 'Email del cliente (si es guest checkout)',
		example: 'customer@example.com',
	})
	@IsEmail()
	@IsOptional()
	customerEmail?: string;

	@ApiPropertyOptional({
		enum: OrderStatus,
		description: 'Estado de la orden',
		default: OrderStatus.PROCESSING,
	})
	@IsEnum(OrderStatus)
	@IsOptional()
	status?: OrderStatus;

	@ApiProperty({ type: [OrderItemDto], description: 'Items de la orden' })
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items!: OrderItemDto[];

	@ApiProperty({ type: OrderPricingDto, description: 'Información de precios' })
	@ValidateNested()
	@Type(() => OrderPricingDto)
	@IsObject()
	pricing!: OrderPricingDto;

	@ApiProperty({ type: ShippingInfoDto, description: 'Información de envío' })
	@ValidateNested()
	@Type(() => ShippingInfoDto)
	@IsObject()
	shippingInfo!: ShippingInfoDto;

	@ApiProperty({ type: PaymentInfoDto, description: 'Información de pago' })
	@ValidateNested()
	@Type(() => PaymentInfoDto)
	@IsObject()
	payment!: PaymentInfoDto;

	@ApiPropertyOptional({
		enum: DeliveryOption,
		description: 'Opción de entrega',
		default: DeliveryOption.DHL,
	})
	@IsEnum(DeliveryOption)
	@IsOptional()
	deliveryOption?: DeliveryOption;
}

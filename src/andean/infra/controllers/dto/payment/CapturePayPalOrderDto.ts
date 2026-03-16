import {
	IsString,
	IsNotEmpty,
	IsOptional,
	IsObject,
	ValidateNested,
	IsEnum,
	ValidateIf,
	IsArray,
	ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	ShippingInfoDto,
	OrderItemDto,
	OrderPricingDto,
} from '../order/CreateOrderDto';
import { DeliveryOption } from 'src/andean/domain/enums/DeliveryOption';

export class CapturePayPalOrderDto {
	@ApiProperty({
		description: 'ID de la orden de PayPal',
	})
	@IsString()
	@IsNotEmpty()
	orderId!: string;

	@ApiProperty({ type: ShippingInfoDto, description: 'Información de envío' })
	@ValidateNested()
	@Type(() => ShippingInfoDto)
	@IsObject()
	shippingInfo!: ShippingInfoDto;

	@ApiPropertyOptional({
		enum: DeliveryOption,
		description: 'Opción de entrega',
	})
	@IsEnum(DeliveryOption)
	@IsOptional()
	deliveryOption?: DeliveryOption;

	@ApiProperty({ description: 'Moneda (USD, PEN, CAD, etc)', example: 'USD' })
	@IsString()
	@IsNotEmpty()
	currency!: string;

	@ApiPropertyOptional({ description: 'ID del cliente (si está logueado)' })
	@IsString()
	@IsOptional()
	customerId?: string;

	@ApiPropertyOptional({
		description: 'Email del cliente (si es guest checkout)',
	})
	@IsString()
	@IsOptional()
	customerEmail?: string;

	@ValidateIf((o) => o.customerEmail && !o.customerId)
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	@ApiPropertyOptional({
		description:
			'Items de la orden (requerido para guest checkout)',
		type: [OrderItemDto],
	})
	items?: OrderItemDto[];

	@ValidateIf((o) => o.customerEmail && !o.customerId)
	@ValidateNested()
	@Type(() => OrderPricingDto)
	@IsObject()
	@ApiPropertyOptional({
		description:
			'Información de precios (requerido para guest checkout)',
		type: OrderPricingDto,
	})
	pricing?: OrderPricingDto;
}

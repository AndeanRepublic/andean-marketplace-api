import {
	IsString,
	IsEnum,
	IsObject,
	ValidateNested,
	IsOptional,
	IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryOption } from 'src/andean/domain/enums/DeliveryOption';
import { ShippingInfoDto, PaymentInfoDto } from './CreateOrderDto';

export class CreateOrderFromCartDto {
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

	@ApiProperty({
		description: 'Moneda (USD, PEN, CAD, etc)',
		example: 'USD',
	})
	@IsString()
	@IsNotEmpty()
	currency!: string;

	@ApiPropertyOptional({
		enum: DeliveryOption,
		description: 'Opción de entrega',
		default: DeliveryOption.DHL,
	})
	@IsEnum(DeliveryOption)
	@IsOptional()
	deliveryOption?: DeliveryOption;
}

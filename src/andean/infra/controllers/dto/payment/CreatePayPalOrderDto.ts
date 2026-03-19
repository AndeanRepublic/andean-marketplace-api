import {
	IsNumber,
	IsString,
	IsNotEmpty,
	IsOptional,
	IsArray,
	ValidateNested,
	Min,
	IsEnum,
	IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryOption } from 'src/andean/domain/enums/DeliveryOption';
export class UnitAmountDto {
	@ApiProperty({ description: 'Valor del precio unitario' })
	@IsString()
	@IsNotEmpty()
	value!: string;
	@ApiProperty({ description: 'Código de moneda' })
	@IsString()
	@IsNotEmpty()
	currencyCode!: string;
}
export class PayPalOrderItemDto {
	@ApiProperty({ description: 'Nombre del item' })
	@IsString()
	@IsNotEmpty()
	name!: string;
	@ApiProperty({ description: 'Cantidad del item', minimum: 1 })
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	quantity!: number;
	@ApiProperty({ description: 'Precio unitario', type: UnitAmountDto })
	@ValidateNested()
	@Type(() => UnitAmountDto)
	@IsNotEmpty()
	unitAmount!: UnitAmountDto;
}
export class CreatePayPalOrderPricingDto {
	@ApiProperty({ description: 'Subtotal de productos', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	subtotal!: number;
	@ApiProperty({ description: 'Descuento total', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	discount!: number;
	@ApiProperty({ description: 'Costo de envio', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	deliveryCost!: number;
	@ApiProperty({ description: 'Impuestos o tarifas', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	taxOrFee!: number;
	@ApiProperty({ description: 'Monto total final', minimum: 0.01 })
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	totalAmount!: number;
}
export class CreatePayPalOrderDto {
	@ApiProperty({
		description: 'Monto total de la orden',
		example: 100.5,
		minimum: 0.01,
	})
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	amount!: number;
	@ApiProperty({
		description: 'Codigo de moneda (USD, PEN, etc.)',
		example: 'USD',
	})
	@IsString()
	@IsNotEmpty()
	currency!: string;
	@ApiPropertyOptional({
		description: 'Items de productos de la orden',
		type: [PayPalOrderItemDto],
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PayPalOrderItemDto)
	items?: PayPalOrderItemDto[];
	@ApiPropertyOptional({
		enum: DeliveryOption,
		description: 'Opcion de entrega',
	})
	@IsOptional()
	@IsEnum(DeliveryOption)
	deliveryOption?: DeliveryOption;
	@ApiPropertyOptional({
		description: 'Desglose de precios para construir el breakdown de PayPal',
		type: CreatePayPalOrderPricingDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreatePayPalOrderPricingDto)
	@IsObject()
	pricing?: CreatePayPalOrderPricingDto;
}

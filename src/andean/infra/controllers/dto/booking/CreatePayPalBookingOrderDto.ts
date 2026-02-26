import {
	IsNumber,
	IsString,
	IsNotEmpty,
	IsOptional,
	IsArray,
	ValidateNested,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayPalOrderItemDto } from '../payment/CreatePayPalOrderDto';

export class CreatePayPalBookingOrderDto {
	@ApiProperty({
		description: 'Monto total del booking',
		example: 250.0,
		minimum: 0.01,
	})
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	amount!: number;

	@ApiProperty({
		description: 'Código de moneda (USD, PEN, etc.)',
		example: 'USD',
	})
	@IsString()
	@IsNotEmpty()
	currency!: string;

	@ApiPropertyOptional({
		description: 'Items del booking (ej. nombre de experiencia)',
		type: [PayPalOrderItemDto],
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PayPalOrderItemDto)
	items?: PayPalOrderItemDto[];

	@ApiPropertyOptional({
		description: 'Ruta de retorno tras aprobar en PayPal',
		example: '/bookings/checkout/success',
	})
	@IsString()
	@IsOptional()
	returnPath?: string;

	@ApiPropertyOptional({
		description: 'Ruta de cancelación en PayPal',
		example: '/bookings/checkout',
	})
	@IsString()
	@IsOptional()
	cancelPath?: string;
}

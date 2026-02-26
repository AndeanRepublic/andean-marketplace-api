import {
	IsString,
	IsNotEmpty,
	IsObject,
	ValidateNested,
	IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
	CustomerInfoDto,
	BookingPricingDto,
	GuestsInfoDto,
	BookingPaymentInfoDto,
} from './CreateBookingDto';

export class CapturePayPalBookingDto {
	@ApiProperty({
		description: 'ID de la orden de PayPal',
		example: '5O190127TN364715T',
	})
	@IsString()
	@IsNotEmpty()
	orderId!: string;

	@ApiProperty({
		type: CustomerInfoDto,
		description: 'Información del cliente',
	})
	@ValidateNested()
	@Type(() => CustomerInfoDto)
	@IsObject()
	customerInfo!: CustomerInfoDto;

	@ApiProperty({ description: 'Fecha de la experiencia' })
	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	experienceDate!: Date;

	@ApiProperty({ description: 'ID de la experiencia' })
	@IsString()
	@IsNotEmpty()
	experienceId!: string;

	@ApiProperty({
		type: BookingPricingDto,
		description: 'Información de precios',
	})
	@ValidateNested()
	@Type(() => BookingPricingDto)
	@IsObject()
	pricing!: BookingPricingDto;

	@ApiProperty({ type: GuestsInfoDto, description: 'Información de huéspedes' })
	@ValidateNested()
	@Type(() => GuestsInfoDto)
	@IsObject()
	guestsInfo!: GuestsInfoDto;

	@ApiProperty({
		type: BookingPaymentInfoDto,
		description: 'Información de pago (será sobrescrita con datos de PayPal)',
	})
	@ValidateNested()
	@Type(() => BookingPaymentInfoDto)
	@IsObject()
	payment!: BookingPaymentInfoDto;
}

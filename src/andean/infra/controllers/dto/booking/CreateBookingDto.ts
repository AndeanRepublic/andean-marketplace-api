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
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { PaymentMethod } from 'src/andean/domain/enums/PaymentMethod';
import { PaymentProvider } from 'src/andean/domain/enums/PaymentProvider';
import { PaymentStatus } from 'src/andean/domain/enums/PaymentStatus';
import { BookingStatus } from 'src/andean/domain/enums/BookingStatus';
import {
	CustomerInfo,
	AgeGroupPricing,
	ExperienceSnapshot,
	ExperienceInfo,
	BookingPricing,
	AgeGroupInfo,
	TravelerInfo,
	GuestsInfo,
	BookingPaymentInfo,
} from 'src/andean/domain/entities/booking/Booking';

export class CustomerInfoDto implements CustomerInfo {
	@ApiPropertyOptional({ description: 'ID del cliente (si está logueado)' })
	@IsString()
	@IsOptional()
	customerId?: string;

	@ApiProperty({
		description: 'Email del cliente',
		example: 'customer@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Nombre', example: 'Juan' })
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@ApiProperty({ description: 'Apellido', example: 'Pérez' })
	@IsString()
	@IsNotEmpty()
	lastName!: string;

	@ApiProperty({ description: 'Teléfono', example: '+51987654321' })
	@IsString()
	@IsNotEmpty()
	phoneNumber!: string;
}

export class BookingPricingDto implements BookingPricing {
	@ApiProperty({ description: 'Subtotal', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	subtotal!: number;

	@ApiProperty({ description: 'Total', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	total!: number;

	@ApiPropertyOptional({ description: 'Monto de descuento', minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsOptional()
	discountAmount?: number;

	@ApiPropertyOptional({ description: 'Monto de impuestos' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	taxAmount?: number;

	@ApiPropertyOptional({ description: 'Monto de tarifas' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	feeAmount?: number;

	@ApiProperty({ description: 'Moneda', example: 'USD' })
	@IsString()
	@IsNotEmpty()
	currency!: string;
}

export class TravelerInfoDto implements TravelerInfo {
	@ApiProperty({ description: 'Nombre', example: 'Juan' })
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@ApiProperty({ description: 'Apellido', example: 'Pérez' })
	@IsString()
	@IsNotEmpty()
	lastName!: string;

	@ApiProperty({ description: 'País', example: 'Perú' })
	@IsString()
	@IsNotEmpty()
	country!: string;

	@ApiProperty({ description: 'Fecha de nacimiento' })
	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	birthDate!: Date;
}

export class AgeGroupInfoDto implements AgeGroupInfo {
	@ApiProperty({
		enum: AgeGroupCode,
		description: 'Código del grupo de edad',
	})
	@IsEnum(AgeGroupCode)
	@IsNotEmpty()
	code!: AgeGroupCode;

	@ApiProperty({
		description: 'Cantidad de personas en este grupo',
		minimum: 0,
		example: 2,
	})
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	quantity!: number;
}

export class GuestsInfoDto {
	@ApiProperty({
		type: [AgeGroupInfoDto],
		description: 'Cantidad de huéspedes por grupo de edad (ej: 2 adultos, 1 niño)',
	})
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => AgeGroupInfoDto)
	ageGroups!: AgeGroupInfoDto[];

	@ApiProperty({ description: 'Total de huéspedes', minimum: 1 })
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	totalGuests!: number;

	@ApiProperty({
		type: [TravelerInfoDto],
		description: 'Información de viajeros',
	})
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => TravelerInfoDto)
	travelersInfo!: TravelerInfoDto[];

	@ApiPropertyOptional({
		description: 'Lugar de llegada',
		example: 'Aeropuerto Jorge Chávez',
	})
	@IsString()
	@IsOptional()
	arrivalPlace?: string;

	@ApiProperty({
		enum: ExperienceLanguage,
		description: 'Idioma preferido',
	})
	@IsEnum(ExperienceLanguage)
	@IsNotEmpty()
	language!: ExperienceLanguage;
}

export class BookingPaymentInfoDto implements BookingPaymentInfo {
	@ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
	@IsEnum(PaymentMethod)
	@IsNotEmpty()
	method!: PaymentMethod;

	@ApiPropertyOptional({ description: 'Monto autorizado' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	amountAuthorized?: number;

	@ApiPropertyOptional({ description: 'Monto capturado' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	amountCaptured?: number;

	@ApiPropertyOptional({ description: 'Monto reembolsado' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	amountRefunded?: number;

	@ApiPropertyOptional({
		enum: PaymentProvider,
		description: 'Proveedor de pago',
	})
	@IsEnum(PaymentProvider)
	@IsOptional()
	provider?: PaymentProvider;

	@ApiProperty({
		enum: PaymentStatus,
		description: 'Estado del pago',
		default: PaymentStatus.PENDING,
	})
	@IsEnum(PaymentStatus)
	@IsNotEmpty()
	status!: PaymentStatus;

	@ApiPropertyOptional({ description: 'ID de transacción del proveedor' })
	@IsString()
	@IsOptional()
	providerTransactionId?: string;

	@ApiPropertyOptional({ description: 'Fecha de pago' })
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	paidAt?: Date;
}

export class CreateBookingDto {
	@ApiPropertyOptional({
		enum: BookingStatus,
		description: 'Estado del booking',
		default: BookingStatus.PENDING,
	})
	@IsEnum(BookingStatus)
	@IsOptional()
	status?: BookingStatus;

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
		description: 'Información de pago',
	})
	@ValidateNested()
	@Type(() => BookingPaymentInfoDto)
	@IsObject()
	payment!: BookingPaymentInfoDto;
}

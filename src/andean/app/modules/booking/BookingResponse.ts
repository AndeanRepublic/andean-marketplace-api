import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { AgeGroupCode } from '../../../domain/enums/AgeGroupCode';
import { ExperienceLanguage } from '../../../domain/enums/ExperienceLanguage';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';

export class CustomerInfoResponse {
	@ApiPropertyOptional({
		description: 'ID del cliente',
		example: '507f191e810c19729de860ea',
	})
	customerId?: string;

	@ApiProperty({
		description: 'Email del cliente',
		example: 'customer@example.com',
	})
	email!: string;

	@ApiProperty({ description: 'Nombre', example: 'Juan' })
	firstName!: string;

	@ApiProperty({ description: 'Apellido', example: 'Pérez' })
	lastName!: string;

	@ApiProperty({ description: 'Teléfono', example: '+51987654321' })
	phoneNumber!: string;
}

export class AgeGroupPricingResponse {
	@ApiProperty({
		description: 'Código del grupo etario',
		enum: AgeGroupCode,
		example: AgeGroupCode.ADULTS,
	})
	code!: AgeGroupCode;

	@ApiProperty({ description: 'Etiqueta', example: 'Adultos' })
	label!: string;

	@ApiPropertyOptional({ description: 'Edad mínima', example: 26 })
	minAge?: number;

	@ApiPropertyOptional({ description: 'Edad máxima', example: 60 })
	maxAge?: number;

	@ApiProperty({ description: 'Precio', example: 100 })
	price!: number;
}

export class ExperienceSnapshotResponse {
	@ApiProperty({ description: 'Nombre de la experiencia' })
	name!: string;

	@ApiProperty({ description: 'Días', example: 3 })
	days!: number;

	@ApiProperty({ description: 'Noches', example: 2 })
	nights!: number;

	@ApiProperty({
		description: 'Precios por grupo etario',
		type: [AgeGroupPricingResponse],
	})
	ageGroupPricing!: AgeGroupPricingResponse[];
}

export class ExperienceInfoResponse {
	@ApiProperty({ description: 'ID de la experiencia' })
	experienceId!: string;

	@ApiProperty({
		description: 'Snapshot de la experiencia',
		type: ExperienceSnapshotResponse,
	})
	experienceSnapshot!: ExperienceSnapshotResponse;
}

export class BookingPricingResponse {
	@ApiProperty({ description: 'Subtotal', example: 200.0 })
	subtotal!: number;

	@ApiProperty({ description: 'Total', example: 180.0 })
	total!: number;

	@ApiPropertyOptional({ description: 'Monto de descuento', example: 20.0 })
	discountAmount?: number;

	@ApiPropertyOptional({ description: 'Monto de impuestos' })
	taxAmount?: number;

	@ApiPropertyOptional({ description: 'Monto de tarifas' })
	feeAmount?: number;

	@ApiProperty({ description: 'Moneda', example: 'USD' })
	currency!: string;
}

export class AgeGroupInfoResponse {
	@ApiProperty({
		description: 'Código del grupo etario',
		enum: AgeGroupCode,
	})
	code!: AgeGroupCode;

	@ApiProperty({ description: 'Cantidad', example: 2 })
	quantity!: number;
}

export class TravelerInfoResponse {
	@ApiProperty({ description: 'Nombre', example: 'Juan' })
	firstName!: string;

	@ApiProperty({ description: 'Apellido', example: 'Pérez' })
	lastName!: string;

	@ApiProperty({ description: 'País', example: 'Perú' })
	country!: string;

	@ApiProperty({ description: 'Fecha de nacimiento' })
	birthDate!: Date;
}

export class GuestsInfoResponse {
	@ApiProperty({
		description: 'Grupos etarios',
		type: [AgeGroupInfoResponse],
	})
	ageGroups!: AgeGroupInfoResponse[];

	@ApiProperty({ description: 'Total de huéspedes', example: 2 })
	totalGuests!: number;

	@ApiProperty({
		description: 'Información de viajeros',
		type: [TravelerInfoResponse],
	})
	travelersInfo!: TravelerInfoResponse[];

	@ApiPropertyOptional({
		description: 'Lugar de llegada',
		example: 'Aeropuerto Jorge Chávez',
	})
	arrivalPlace?: string;

	@ApiProperty({
		description: 'Idioma preferido',
		enum: ExperienceLanguage,
	})
	language!: ExperienceLanguage;
}

export class BookingPaymentInfoResponse {
	@ApiProperty({
		description: 'Método de pago',
		enum: PaymentMethod,
	})
	method!: PaymentMethod;

	@ApiPropertyOptional({ description: 'Monto autorizado' })
	amountAuthorized?: number;

	@ApiPropertyOptional({ description: 'Monto capturado' })
	amountCaptured?: number;

	@ApiPropertyOptional({ description: 'Monto reembolsado' })
	amountRefunded?: number;

	@ApiPropertyOptional({
		description: 'Proveedor de pago',
		enum: PaymentProvider,
	})
	provider?: PaymentProvider;

	@ApiProperty({
		description: 'Estado del pago',
		enum: PaymentStatus,
	})
	status!: PaymentStatus;

	@ApiPropertyOptional({ description: 'ID de transacción del proveedor' })
	providerTransactionId?: string;

	@ApiPropertyOptional({ description: 'Fecha de pago' })
	paidAt?: Date;
}

export class BookingResponse {
	@ApiProperty({
		description: 'ID del booking',
		example: '507f1f77bcf86cd799439011',
	})
	id!: string;

	@ApiProperty({
		description: 'Información del cliente',
		type: CustomerInfoResponse,
	})
	customerInfo!: CustomerInfoResponse;

	@ApiProperty({
		description: 'Estado del booking',
		enum: BookingStatus,
		example: BookingStatus.PENDING,
	})
	status!: BookingStatus;

	@ApiProperty({
		description: 'Fecha de la experiencia',
		example: '2026-03-15T00:00:00Z',
	})
	experienceDate!: Date;

	@ApiProperty({
		description: 'Información de la experiencia',
		type: ExperienceInfoResponse,
	})
	experience!: ExperienceInfoResponse;

	@ApiProperty({
		description: 'Información de precios',
		type: BookingPricingResponse,
	})
	pricing!: BookingPricingResponse;

	@ApiProperty({
		description: 'Información de huéspedes',
		type: GuestsInfoResponse,
	})
	guestsInfo!: GuestsInfoResponse;

	@ApiProperty({
		description: 'Información de pago',
		type: BookingPaymentInfoResponse,
	})
	payment!: BookingPaymentInfoResponse;

	@ApiProperty({
		description: 'Fecha de creación',
		example: '2026-02-10T10:00:00Z',
	})
	createdAt!: Date;

	@ApiProperty({
		description: 'Fecha de actualización',
		example: '2026-02-10T10:30:00Z',
	})
	updatedAt!: Date;
}

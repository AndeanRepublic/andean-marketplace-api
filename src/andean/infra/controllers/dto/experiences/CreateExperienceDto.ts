import {
	IsString,
	IsNotEmpty,
	IsEnum,
	IsArray,
	IsNumber,
	IsOptional,
	ValidateNested,
	IsInt,
	Min,
	Max,
	IsBoolean,
	IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceStatus } from 'src/andean/domain/enums/ExperienceStatus';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';

// ─── BasicInfo DTO ───

export class ExperienceBasicInfoDto {
	@ApiProperty({ description: 'Título de la experiencia', example: 'Trekking al Valle Sagrado' })
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty({ description: 'Ubicación de la experiencia', example: 'Cusco, Perú' })
	@IsString()
	@IsNotEmpty()
	ubication!: string;

	@ApiProperty({ description: 'Número de días', example: 3 })
	@IsInt()
	@Min(1)
	days!: number;

	@ApiProperty({ description: 'Número de noches', example: 2 })
	@IsInt()
	@Min(0)
	nights!: number;

	@ApiProperty({ description: 'Número mínimo del grupo', example: 2 })
	@IsInt()
	@Min(1)
	minNumberGroup!: number;

	@ApiProperty({ description: 'Número máximo del grupo', example: 15 })
	@IsInt()
	@Min(1)
	maxNumberGroup!: number;

	@ApiProperty({
		description: 'Idiomas disponibles para la experiencia',
		enum: ExperienceLanguage,
		isArray: true,
		example: [ExperienceLanguage.ESPAÑOL, ExperienceLanguage.ENGLISH],
	})
	@IsArray()
	@IsEnum(ExperienceLanguage, { each: true })
	languages!: ExperienceLanguage[];

	@ApiProperty({
		description: 'Tipo de propietario',
		enum: OwnerType,
		example: OwnerType.COMMUNITY,
	})
	@IsEnum(OwnerType)
	ownerType!: OwnerType;

	@ApiProperty({ description: 'ID del propietario (comunidad)', example: '507f1f77bcf86cd799439011' })
	@IsString()
	@IsNotEmpty()
	ownerId!: string;

	@ApiPropertyOptional({ description: 'Categoría de la experiencia', example: 'trekking' })
	@IsString()
	@IsOptional()
	category?: string;
}

// ─── MediaInfo DTO ───

export class ExperienceMediaInfoDto {
	@ApiProperty({ description: 'ID del MediaItem para imagen landscape', example: '507f1f77bcf86cd799439013' })
	@IsString()
	@IsNotEmpty()
	landscapeImg!: string;

	@ApiProperty({ description: 'ID del MediaItem para thumbnail', example: '507f1f77bcf86cd799439014' })
	@IsString()
	@IsNotEmpty()
	thumbnailImg!: string;

	@ApiPropertyOptional({
		description: 'IDs de MediaItems para fotos',
		type: [String],
		example: ['507f1f77bcf86cd799439015'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	photos?: string[];

	@ApiPropertyOptional({
		description: 'IDs de MediaItems para videos',
		type: [String],
		example: ['507f1f77bcf86cd799439016'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	videos?: string[];
}

// ─── DetailInfo DTO ───

export class ExperienceDetailInfoDto {
	@ApiProperty({ description: 'Descripción corta', example: 'Una experiencia única en los Andes' })
	@IsString()
	@IsNotEmpty()
	shortDescription!: string;

	@ApiProperty({ description: 'Descripción larga' })
	@IsString()
	@IsNotEmpty()
	largeDescription!: string;

	@ApiProperty({ description: 'Qué incluye', type: [String], example: ['Transporte', 'Almuerzo'] })
	@IsArray()
	@IsString({ each: true })
	includes!: string[];

	@ApiProperty({ description: 'Qué no incluye', type: [String], example: ['Seguro de viaje'] })
	@IsArray()
	@IsString({ each: true })
	notIncludes!: string[];

	@ApiProperty({ description: 'Detalle de recogida', example: 'Hotel en Cusco a las 6:00 AM' })
	@IsString()
	@IsNotEmpty()
	pickupDetail!: string;

	@ApiProperty({ description: 'Detalle de retorno', example: 'Retorno al hotel a las 6:00 PM' })
	@IsString()
	@IsNotEmpty()
	returnDetail!: string;

	@ApiProperty({ description: 'Detalle de alojamiento', example: 'Hospedaje en casa comunal' })
	@IsString()
	@IsNotEmpty()
	accommodationDetail!: string;

	@ApiProperty({ description: 'Detalle de accesibilidad', example: 'Apto para personas con movilidad reducida' })
	@IsString()
	@IsNotEmpty()
	accessibilityDetail!: string;

	@ApiProperty({ description: 'Política de cancelación', example: 'Cancelación gratuita hasta 48h antes' })
	@IsString()
	@IsNotEmpty()
	cancellationPolicy!: string;

	@ApiPropertyOptional({ description: 'Qué debería llevar', type: [String], example: ['Protector solar', 'Agua'] })
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	shouldCarry?: string[];

	@ApiPropertyOptional({ description: 'Información adicional', type: [String] })
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	aditionalInformation?: string[];

	@ApiPropertyOptional({ description: 'Número de contacto', example: '+51 984 123 456' })
	@IsString()
	@IsOptional()
	contactNumber?: string;
}

// ─── Prices DTO ───

export class AgeGroupDto {
	@ApiProperty({ description: 'Código del grupo de edad', enum: AgeGroupCode, example: AgeGroupCode.ADULTS })
	@IsEnum(AgeGroupCode)
	code!: AgeGroupCode;

	@ApiProperty({ description: 'Etiqueta del grupo', example: 'Adultos' })
	@IsString()
	@IsNotEmpty()
	label!: string;

	@ApiProperty({ description: 'Precio para este grupo', example: 100 })
	@IsNumber()
	@Min(0)
	price!: number;

	@ApiPropertyOptional({ description: 'Edad mínima', example: 26 })
	@IsInt()
	@IsOptional()
	minAge?: number;

	@ApiPropertyOptional({ description: 'Edad máxima', example: 60 })
	@IsInt()
	@IsOptional()
	maxAge?: number;
}

export class ExperiencePricesDto {
	@ApiProperty({ description: 'Usa precios basados en edad', example: true })
	@IsBoolean()
	useAgeBasedPricing!: boolean;

	@ApiProperty({ description: 'Moneda', example: 'USD', default: 'USD' })
	@IsString()
	@IsNotEmpty()
	currency!: string;

	@ApiProperty({ description: 'Grupos de edad con precios', type: [AgeGroupDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AgeGroupDto)
	ageGroups!: AgeGroupDto[];
}

// ─── Availability DTO ───

export class ExperienceAvailabilityDto {
	@ApiProperty({
		description: 'Días de la semana en que inicia (0=Domingo, 1=Lunes...)',
		enum: WeekDay,
		isArray: true,
		example: [WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY],
	})
	@IsArray()
	@IsEnum(WeekDay, { each: true })
	weeklyStartDays!: WeekDay[];

	@ApiPropertyOptional({
		description: 'Fechas específicas disponibles',
		type: [String],
		example: ['2026-03-15', '2026-04-01'],
	})
	@IsArray()
	@IsDateString({}, { each: true })
	@IsOptional()
	specificAvailableDates?: string[];

	@ApiPropertyOptional({
		description: 'Fechas excluidas',
		type: [String],
		example: ['2026-03-20'],
	})
	@IsArray()
	@IsDateString({}, { each: true })
	@IsOptional()
	excludedDates?: string[];
}

// ─── Itinerary DTO ───

export class ItineraryScheduleDto {
	@ApiProperty({ description: 'Hora de la actividad', example: '08:00' })
	@IsString()
	@IsNotEmpty()
	time!: string;

	@ApiProperty({ description: 'Descripción de la actividad', example: 'Desayuno tradicional' })
	@IsString()
	@IsNotEmpty()
	activity!: string;
}

export class ExperienceItineraryDto {
	@ApiProperty({ description: 'Número del día', example: 1 })
	@IsInt()
	@Min(1)
	numberDay!: number;

	@ApiProperty({ description: 'Nombre del día', example: 'Día de llegada' })
	@IsString()
	@IsNotEmpty()
	nameDay!: string;

	@ApiProperty({ description: 'Descripción del día' })
	@IsString()
	@IsNotEmpty()
	descriptionDay!: string;

	@ApiPropertyOptional({
		description: 'IDs de MediaItems para fotos del día',
		type: [String],
		example: ['507f1f77bcf86cd799439017'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	photos?: string[];

	@ApiProperty({ description: 'Cronograma del día', type: [ItineraryScheduleDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ItineraryScheduleDto)
	schedule!: ItineraryScheduleDto[];
}

// ─── Main Create DTO ───

export class CreateExperienceDto {
	@ApiProperty({
		description: 'Estado de la experiencia',
		enum: ExperienceStatus,
		example: ExperienceStatus.PUBLISHED,
	})
	@IsEnum(ExperienceStatus)
	status!: ExperienceStatus;

	@ApiProperty({ description: 'Información básica', type: ExperienceBasicInfoDto })
	@ValidateNested()
	@Type(() => ExperienceBasicInfoDto)
	basicInfo!: ExperienceBasicInfoDto;

	@ApiProperty({ description: 'Información multimedia', type: ExperienceMediaInfoDto })
	@ValidateNested()
	@Type(() => ExperienceMediaInfoDto)
	mediaInfo!: ExperienceMediaInfoDto;

	@ApiProperty({ description: 'Información de detalle', type: ExperienceDetailInfoDto })
	@ValidateNested()
	@Type(() => ExperienceDetailInfoDto)
	detailInfo!: ExperienceDetailInfoDto;

	@ApiProperty({ description: 'Precios', type: ExperiencePricesDto })
	@ValidateNested()
	@Type(() => ExperiencePricesDto)
	prices!: ExperiencePricesDto;

	@ApiProperty({ description: 'Disponibilidad', type: ExperienceAvailabilityDto })
	@ValidateNested()
	@Type(() => ExperienceAvailabilityDto)
	availability!: ExperienceAvailabilityDto;

	@ApiProperty({ description: 'Itinerario por días', type: [ExperienceItineraryDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExperienceItineraryDto)
	itineraries!: ExperienceItineraryDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';

// ─── Prices Patch Response ──────────────────────────────────────────────────

export class AgeGroupPatchResponse {
	@ApiProperty({
		description: 'Código del grupo de edad',
		enum: AgeGroupCode,
		example: AgeGroupCode.ADULTS,
	})
	code!: AgeGroupCode;

	@ApiProperty({
		description: 'Etiqueta del grupo',
		example: 'Adultos',
	})
	label!: string;

	@ApiProperty({
		description: 'Precio actualizado para este grupo',
		example: 150,
	})
	price!: number;

	@ApiPropertyOptional({
		description: 'Edad mínima del grupo',
		example: 18,
	})
	minAge?: number;

	@ApiPropertyOptional({
		description: 'Edad máxima del grupo',
		example: 65,
	})
	maxAge?: number;
}

export class ExperiencePricesPatchResponse {
	@ApiProperty({
		description: 'ID del documento de precios',
		example: 'prices-001',
	})
	id!: string;

	@ApiProperty({
		description: 'Indica si los precios se basan en grupos de edad',
		example: true,
	})
	useAgeBasedPricing!: boolean;

	@ApiProperty({
		description: 'Moneda de los precios',
		example: 'USD',
	})
	currency!: string;

	@ApiProperty({
		description:
			'Lista completa de grupos de edad con sus precios actualizados',
		type: [AgeGroupPatchResponse],
	})
	ageGroups!: AgeGroupPatchResponse[];
}

// ─── Availability Patch Response ────────────────────────────────────────────

export class ExperienceAvailabilityPatchResponse {
	@ApiProperty({
		description: 'ID del documento de disponibilidad',
		example: 'availability-001',
	})
	id!: string;

	@ApiProperty({
		description: 'Modo de disponibilidad',
		enum: ExperienceAvailabilityMode,
		example: ExperienceAvailabilityMode.EXCLUSIVE_GROUP,
	})
	mode!: ExperienceAvailabilityMode;

	@ApiProperty({
		description: 'Días de la semana en que inicia la experiencia',
		enum: WeekDay,
		isArray: true,
		example: [WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY],
	})
	weeklyStartDays!: WeekDay[];

	@ApiProperty({
		description: 'Fechas de inicio específicas disponibles',
		type: [Date],
		example: ['2026-04-01', '2026-04-15'],
	})
	specificAvailableStartDates!: Date[];

	@ApiProperty({
		description: 'Fechas excluidas de la disponibilidad',
		type: [Date],
		example: ['2026-12-25', '2026-01-01'],
	})
	excludedDates!: Date[];
}

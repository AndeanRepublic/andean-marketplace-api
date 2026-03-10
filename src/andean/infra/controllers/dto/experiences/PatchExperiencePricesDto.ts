import { IsArray, IsDateString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';

// ─── Prices ───

export class PatchAgeGroupPriceDto {
	@ApiProperty({
		description: 'Código del grupo de edad a actualizar',
		enum: AgeGroupCode,
		example: AgeGroupCode.ADULTS,
	})
	@IsEnum(AgeGroupCode)
	code!: AgeGroupCode;

	@ApiProperty({
		description: 'Nuevo precio para este grupo de edad',
		example: 150,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	price!: number;
}

// ─── Availability — Excluded Dates ───

export class PatchExcludedDatesDto {
	@ApiProperty({
		description:
			'Lista completa de fechas excluidas (reemplaza el array actual). Formato ISO 8601.',
		type: [String],
		example: ['2026-12-25', '2026-01-01', '2026-03-20'],
	})
	@IsArray()
	@IsDateString({}, { each: true })
	excludedDates!: string[];
}

// ─── Availability — Specific Available Dates ───

export class PatchAvailableDatesDto {
	@ApiProperty({
		description:
			'Lista completa de fechas de inicio disponibles (reemplaza el array actual). Formato ISO 8601.',
		type: [String],
		example: ['2026-04-01', '2026-04-15', '2026-05-01'],
	})
	@IsArray()
	@IsDateString({}, { each: true })
	specificAvailableStartDates!: string[];
}

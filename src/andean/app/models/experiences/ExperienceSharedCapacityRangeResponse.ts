import { ApiProperty } from '@nestjs/swagger';

export class SharedCapacityDateItemResponse {
	@ApiProperty({
		description: 'Fecha de inicio evaluada',
		type: Date,
		example: '2026-04-01',
	})
	date!: Date;

	@ApiProperty({
		description: 'Capacidad máxima configurada para la experiencia',
		example: 15,
	})
	maxCapacity!: number;

	@ApiProperty({
		description: 'Cupos ya reservados para esta fecha',
		example: 9,
	})
	reservedGuests!: number;

	@ApiProperty({
		description: 'Cupos restantes para esta fecha',
		example: 6,
	})
	remainingGuests!: number;
}

export class ExperienceSharedCapacityRangeResponse {
	@ApiProperty({
		description: 'ID de la experiencia consultada',
		example: '507f1f77bcf86cd799439011',
	})
	experienceId!: string;

	@ApiProperty({
		description: 'Fecha inicial aplicada al rango',
		type: Date,
		example: '2026-04-01',
	})
	from!: Date;

	@ApiProperty({
		description: 'Fecha final aplicada al rango',
		type: Date,
		example: '2026-04-30',
	})
	to!: Date;

	@ApiProperty({
		description: 'Cantidad de fechas retornadas en el rango',
		example: 8,
	})
	totalDates!: number;

	@ApiProperty({
		description: 'Fechas con estado de cupos',
		type: [SharedCapacityDateItemResponse],
	})
	items!: SharedCapacityDateItemResponse[];
}


import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetSharedCapacityRangeDto {
	@ApiPropertyOptional({
		description: 'Fecha inicial del rango (YYYY-MM-DD).',
		example: '2026-04-01',
	})
	@IsDateString()
	@IsOptional()
	from?: string;

	@ApiPropertyOptional({
		description: 'Fecha final del rango (YYYY-MM-DD).',
		example: '2026-04-30',
	})
	@IsDateString()
	@IsOptional()
	to?: string;
}


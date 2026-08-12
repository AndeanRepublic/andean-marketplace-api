import {
	IsArray,
	ValidateNested,
	IsBoolean,
	IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TraceabilityEpochDto } from './TraceabilityEpochDto';

export class CreateProductTraceabilityDto {
	@ApiProperty({
		description:
			'Indica si las variantes están registradas en Identi (códigos como SKU)',
		example: false,
		default: false,
	})
	@IsBoolean()
	blockchainActive: boolean;

	@ApiPropertyOptional({
		description: 'Lista de épocas/etapas del proceso de producción',
		type: [TraceabilityEpochDto],
		isArray: true,
		default: [],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TraceabilityEpochDto)
	@IsOptional()
	epochs?: TraceabilityEpochDto[];
}

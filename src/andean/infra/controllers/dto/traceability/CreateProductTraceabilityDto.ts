import {
	IsNotEmpty,
	IsString,
	IsArray,
	ValidateNested,
	IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TraceabilityEpochDto } from './TraceabilityEpochDto';

export class CreateProductTraceabilityDto {
	@ApiProperty({
		description: 'Enlace a la blockchain para verificación',
		example: 'https://etherscan.io/tx/0x1234567890abcdef',
	})
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	blockchainLink: string;

	@ApiProperty({
		description: 'Lista de épocas/etapas del proceso de producción',
		type: [TraceabilityEpochDto],
		isArray: true,
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TraceabilityEpochDto)
	epochs: TraceabilityEpochDto[];
}

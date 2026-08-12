import { ApiProperty } from '@nestjs/swagger';
import { TraceabilityProcessName } from '../../../domain/enums/TraceabilityProcessName';

export class TraceabilityEpochResponse {
	@ApiProperty({
		description: 'Título de la época/etapa',
		example: 'Cosecha',
	})
	title: string;

	@ApiProperty({
		description: 'País',
		example: 'Perú',
	})
	country: string;

	@ApiProperty({
		description: 'Ciudad',
		example: 'Cusco',
	})
	city: string;

	@ApiProperty({
		description: 'Descripción',
		example: 'Recolección manual de quinoa',
	})
	description: string;

	@ApiProperty({
		description: 'Nombre del proceso',
		enum: TraceabilityProcessName,
		example: TraceabilityProcessName.ORIGIN,
	})
	processName: TraceabilityProcessName;

	@ApiProperty({
		description: 'Proveedor',
		example: 'Cooperativa Agrícola Cusco',
	})
	supplier: string;
}

export class ProductTraceabilityResponse {
	@ApiProperty({
		description: 'ID único de la trazabilidad',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string;

	@ApiProperty({
		description:
			'Indica si las variantes están registradas en Identi (códigos como SKU)',
		example: false,
	})
	blockchainActive: boolean;

	@ApiProperty({
		description: 'Épocas/etapas del proceso',
		type: [TraceabilityEpochResponse],
	})
	epochs: TraceabilityEpochResponse[];
}

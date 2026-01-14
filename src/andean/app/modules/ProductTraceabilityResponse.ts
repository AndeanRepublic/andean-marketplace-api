import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../domain/enums/ProductType';

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
		example: 'Cosecha manual',
	})
	processName: string;

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
		description: 'ID del producto',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	productId: string;

	@ApiProperty({
		description: 'Tipo de producto',
		enum: ProductType,
		example: ProductType.SUPERFOOD,
	})
	productType: ProductType;

	@ApiProperty({
		description: 'Enlace a blockchain',
		example: 'https://etherscan.io/tx/0x1234567890abcdef',
	})
	blockchainLink: string;

	@ApiProperty({
		description: 'Épocas/etapas del proceso',
		type: [TraceabilityEpochResponse],
	})
	epochs: TraceabilityEpochResponse[];
}

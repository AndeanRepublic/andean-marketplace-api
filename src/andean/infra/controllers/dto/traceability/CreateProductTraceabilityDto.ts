import { IsNotEmpty, IsString, IsEnum, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductType } from '../../../../domain/enums/ProductType';
import { TraceabilityEpochDto } from './TraceabilityEpochDto';

export class CreateProductTraceabilityDto {
	@ApiProperty({
		description: 'ID del producto (superfood, textile, o experience)',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsString()
	@IsNotEmpty()
	productId: string;

	@ApiProperty({
		description: 'Tipo de producto',
		enum: ProductType,
		example: ProductType.SUPERFOOD,
	})
	@IsEnum(ProductType)
	productType: ProductType;

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

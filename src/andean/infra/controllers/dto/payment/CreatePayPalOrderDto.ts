import {
	IsNumber,
	IsString,
	IsNotEmpty,
	IsOptional,
	IsArray,
	ValidateNested,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnitAmountDto {
	@ApiProperty({ description: 'Valor del precio unitario' })
	@IsString()
	@IsNotEmpty()
	value!: string;

	@ApiProperty({ description: 'Código de moneda' })
	@IsString()
	@IsNotEmpty()
	currencyCode!: string;
}

export class PayPalOrderItemDto {
	@ApiProperty({ description: 'Nombre del item' })
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ description: 'Cantidad del item', minimum: 1 })
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Precio unitario', type: UnitAmountDto })
	@ValidateNested()
	@Type(() => UnitAmountDto)
	@IsNotEmpty()
	unitAmount!: UnitAmountDto;
}

export class CreatePayPalOrderDto {
	@ApiProperty({
		description: 'Monto total de la orden',
		example: 100.5,
		minimum: 0.01,
	})
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	amount!: number;

	@ApiProperty({
		description: 'Código de moneda (USD, PEN, etc.)',
		example: 'USD',
	})
	@IsString()
	@IsNotEmpty()
	currency!: string;

	@ApiPropertyOptional({
		description: 'Items de la orden (opcional)',
		type: [PayPalOrderItemDto],
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PayPalOrderItemDto)
	items?: PayPalOrderItemDto[];
}

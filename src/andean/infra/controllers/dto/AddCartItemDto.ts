import {
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateIf,
	IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCartItemDto {
	@ApiPropertyOptional({
		description:
			'ID de la variante (superfood, textil, etc.). Mutuamente excluyente con boxId.',
		example: 'variant-uuid-1234',
	})
	@ValidateIf((o) => !o.boxId?.trim())
	@IsString()
	@IsNotEmpty({ message: 'variantId es obligatorio si no envía boxId' })
	variantId?: string;

	@ApiPropertyOptional({
		description:
			'ID de la caja (BOX). Mutuamente excluyente con variantId; la caja no usa variante en el carrito.',
		example: 'box-uuid-5678',
	})
	@ValidateIf((o) => !o.variantId?.trim())
	@IsString()
	@IsNotEmpty({ message: 'boxId es obligatorio si no envía variantId' })
	boxId?: string;

	@ApiProperty({
		description: 'Cantidad a agregar al carrito',
		example: 2,
		minimum: 1,
	})
	@IsNumber()
	@Min(1)
	quantity!: number;
}

import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodSalesUnitSizeDto } from './CreateSuperfoodSalesUnitSizeDto';

export class CreateManySuperfoodSalesUnitSizesDto {
	@ApiProperty({
		description: 'Lista de tamaños de unidad de venta de superfood a crear',
		type: [CreateSuperfoodSalesUnitSizeDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodSalesUnitSizeDto)
	superfoodSalesUnitSizes: CreateSuperfoodSalesUnitSizeDto[];
}

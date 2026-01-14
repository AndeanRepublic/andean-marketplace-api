import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodSalesUnitSizeDto {
	@ApiProperty({
		description: 'Nombre del tamaño de unidad de venta',
		example: '500g',
		minLength: 1,
		maxLength: 50,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono del tamaño',
		example: 'https://example.com/icons/500g.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}

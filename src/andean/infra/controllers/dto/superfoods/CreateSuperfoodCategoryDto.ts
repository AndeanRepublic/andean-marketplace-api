import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodCategoryDto {
	@ApiProperty({
		description: 'Nombre de la categoría de superfood',
		example: 'Quinua',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Estado de la categoría',
		enum: ['ENABLED', 'DISABLED'],
		default: 'ENABLED',
		required: false,
	})
	@IsEnum(['ENABLED', 'DISABLED'])
	@IsOptional()
	status?: 'ENABLED' | 'DISABLED';
}

import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TraceabilityEpochDto {
	@ApiProperty({
		description: 'Título de la época/etapa del proceso',
		example: 'Cosecha',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	title: string;

	@ApiProperty({
		description: 'País donde ocurrió esta etapa',
		example: 'Perú',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	country: string;

	@ApiProperty({
		description: 'Ciudad donde ocurrió esta etapa',
		example: 'Cusco',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	city: string;

	@ApiProperty({
		description: 'Descripción detallada de esta etapa',
		example: 'Recolección manual de quinoa en los campos de altura',
		minLength: 10,
		maxLength: 1000,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	@MaxLength(1000)
	description: string;

	@ApiProperty({
		description: 'Nombre del proceso realizado',
		example: 'Cosecha manual',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	processName: string;

	@ApiProperty({
		description: 'Nombre del proveedor o responsable',
		example: 'Cooperativa Agrícola Cusco',
		minLength: 2,
		maxLength: 200,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(200)
	supplier: string;
}

import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOriginProductRegionDto {
	@ApiProperty({
		description: 'Nombre de la región de origen',
		example: 'Cusco',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	name: string;
}

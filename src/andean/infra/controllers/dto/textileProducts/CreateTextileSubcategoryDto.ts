import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextileSubcategoryDto {
	@ApiProperty({
		description: 'Nombre de la subcategoría textil',
		example: 'Ponchos de Alpaca',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextileTypeDto {
	@ApiProperty({
		description: 'Nombre del tipo de textil',
		example: 'Lana de Alpaca',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

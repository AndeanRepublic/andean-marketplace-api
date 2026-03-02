import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextileStyleDto {
	@ApiProperty({
		description: 'Nombre del estilo textil',
		example: 'Tradicional Andino',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

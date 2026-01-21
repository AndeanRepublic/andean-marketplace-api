import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextilePrincipalUseDto {
	@ApiProperty({
		description: 'Nombre del uso principal del textil',
		example: 'Casual',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

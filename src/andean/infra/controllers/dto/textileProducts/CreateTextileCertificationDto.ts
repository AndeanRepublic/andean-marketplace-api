import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextileCertificationDto {
	@ApiProperty({
		description: 'Nombre de la certificación textil',
		example: 'Fair Trade',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

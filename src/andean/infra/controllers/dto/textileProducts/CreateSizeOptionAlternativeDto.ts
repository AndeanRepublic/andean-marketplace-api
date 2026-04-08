import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeOptionAlternativeDto {
	@ApiProperty({
		description: 'Nombre de la talla',
		example: 'M',
		minLength: 1,
		maxLength: 20,
	})
	@IsString()
	@IsNotEmpty()
	nameLabel!: string;
}

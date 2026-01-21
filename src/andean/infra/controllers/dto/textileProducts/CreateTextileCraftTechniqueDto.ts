import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextileCraftTechniqueDto {
	@ApiProperty({
		description: 'Nombre de la técnica artesanal',
		example: 'Telar de cintura',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}

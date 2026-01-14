import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityDto {
	@ApiProperty({
		description: 'Nombre de la comunidad',
		example: 'Comunidad Artesanal de Cusco',
		minLength: 3,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	name: string;
}

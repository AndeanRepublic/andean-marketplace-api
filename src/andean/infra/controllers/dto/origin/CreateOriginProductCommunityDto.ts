import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOriginProductCommunityDto {
	@ApiProperty({
		description: 'Nombre de la comunidad de origen',
		example: 'Comunidad de Pisac',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	name: string;

	@ApiProperty({
		description: 'ID de la región a la que pertenece la comunidad',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	@IsString()
	@IsNotEmpty()
	regionId: string;
}

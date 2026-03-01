import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateColorOptionAlternativeDto } from './CreateColorOptionAlternativeDto';

export class CreateManyColorOptionAlternativesDto {
	@ApiProperty({
		description: 'Lista de opciones alternativas de color a crear',
		type: [CreateColorOptionAlternativeDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateColorOptionAlternativeDto)
	colorOptionAlternatives: CreateColorOptionAlternativeDto[];
}

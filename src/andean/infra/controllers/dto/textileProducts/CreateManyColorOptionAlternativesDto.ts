import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateColorOptionAlternativeDto } from './CreateColorOptionAlternativeDto';

export class CreateManyColorOptionAlternativesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateColorOptionAlternativeDto)
	colorOptionAlternatives: CreateColorOptionAlternativeDto[];
}

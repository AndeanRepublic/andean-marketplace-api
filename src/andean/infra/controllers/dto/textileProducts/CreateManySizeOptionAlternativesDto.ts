import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSizeOptionAlternativeDto } from './CreateSizeOptionAlternativeDto';

export class CreateManySizeOptionAlternativesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSizeOptionAlternativeDto)
	sizeOptionAlternatives: CreateSizeOptionAlternativeDto[];
}

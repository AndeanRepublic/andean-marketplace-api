import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSizeOptionAlternativeDto } from './CreateSizeOptionAlternativeDto';

export class CreateManySizeOptionAlternativesDto {
	@ApiProperty({
		description: 'Lista de opciones alternativas de talla a crear',
		type: [CreateSizeOptionAlternativeDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSizeOptionAlternativeDto)
	sizeOptionAlternatives: CreateSizeOptionAlternativeDto[];
}

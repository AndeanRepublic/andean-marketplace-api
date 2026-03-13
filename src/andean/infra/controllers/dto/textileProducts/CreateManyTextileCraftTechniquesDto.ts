import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextileCraftTechniqueDto } from './CreateTextileCraftTechniqueDto';

export class CreateManyTextileCraftTechniquesDto {
	@ApiProperty({
		description: 'Lista de técnicas artesanales a crear',
		type: [CreateTextileCraftTechniqueDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextileCraftTechniqueDto)
	textileCraftTechniques: CreateTextileCraftTechniqueDto[];
}

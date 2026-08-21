import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateExperienceCategoryDto } from './CreateExperienceCategoryDto';

export class CreateManyExperienceCategoriesDto {
	@ApiProperty({
		description: 'Lista de categorías de experiencia a crear',
		type: [CreateExperienceCategoryDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateExperienceCategoryDto)
	experienceCategories!: CreateExperienceCategoryDto[];
}

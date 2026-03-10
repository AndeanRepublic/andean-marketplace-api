import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodCategoryDto } from './CreateSuperfoodCategoryDto';

export class CreateManySuperfoodCategoriesDto {
	@ApiProperty({
		description: 'Lista de categorías de superfood a crear',
		type: [CreateSuperfoodCategoryDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodCategoryDto)
	superfoodCategories: CreateSuperfoodCategoryDto[];
}

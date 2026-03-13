import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextileCategoryDto } from './CreateTextileCategory';

export class CreateManyTextileCategoriesDto {
	@ApiProperty({
		description: 'Lista de categorías textiles a crear',
		type: [CreateTextileCategoryDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextileCategoryDto)
	textileCategories: CreateTextileCategoryDto[];
}

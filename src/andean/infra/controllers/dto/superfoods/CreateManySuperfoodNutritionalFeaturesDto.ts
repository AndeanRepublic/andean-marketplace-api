import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodNutritionalFeatureDto } from './CreateSuperfoodNutritionalFeatureDto';

export class CreateManySuperfoodNutritionalFeaturesDto {
	@ApiProperty({
		description: 'Lista de características nutricionales de superfood a crear',
		type: [CreateSuperfoodNutritionalFeatureDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodNutritionalFeatureDto)
	superfoodNutritionalFeatures: CreateSuperfoodNutritionalFeatureDto[];
}

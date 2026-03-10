import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodProductPresentationDto } from './CreateSuperfoodProductPresentationDto';

export class CreateManySuperfoodProductPresentationsDto {
	@ApiProperty({
		description: 'Lista de presentaciones de producto de superfood a crear',
		type: [CreateSuperfoodProductPresentationDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodProductPresentationDto)
	superfoodProductPresentations: CreateSuperfoodProductPresentationDto[];
}

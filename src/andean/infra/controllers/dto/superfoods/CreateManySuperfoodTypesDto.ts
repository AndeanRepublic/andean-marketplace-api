import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodTypeDto } from './CreateSuperfoodTypeDto';

export class CreateManySuperfoodTypesDto {
	@ApiProperty({
		description: 'Lista de tipos de superfood a crear',
		type: [CreateSuperfoodTypeDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodTypeDto)
	superfoodTypes: CreateSuperfoodTypeDto[];
}

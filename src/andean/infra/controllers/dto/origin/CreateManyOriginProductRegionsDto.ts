import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOriginProductRegionDto } from './CreateOriginProductRegionDto';

export class CreateManyOriginProductRegionsDto {
	@ApiProperty({
		description: 'Lista de regiones de origen a crear',
		type: [CreateOriginProductRegionDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOriginProductRegionDto)
	originProductRegions: CreateOriginProductRegionDto[];
}

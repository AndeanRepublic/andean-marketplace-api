import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodPreservationMethodDto } from './CreateSuperfoodPreservationMethodDto';

export class CreateManySuperfoodPreservationMethodsDto {
	@ApiProperty({
		description: 'Lista de métodos de preservación de superfood a crear',
		type: [CreateSuperfoodPreservationMethodDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodPreservationMethodDto)
	superfoodPreservationMethods: CreateSuperfoodPreservationMethodDto[];
}

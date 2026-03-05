import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextileTypeDto } from './CreateTextileTypeDto';

export class CreateManyTextileTypesDto {
	@ApiProperty({
		description: 'Lista de tipos de textil a crear',
		type: [CreateTextileTypeDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextileTypeDto)
	textileTypes: CreateTextileTypeDto[];
}

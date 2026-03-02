import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSealDto } from './CreateSealDto';

export class CreateManySealsDto {
	@ApiProperty({
		description: 'Lista de sellos a crear',
		type: [CreateSealDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSealDto)
	seals: CreateSealDto[];
}

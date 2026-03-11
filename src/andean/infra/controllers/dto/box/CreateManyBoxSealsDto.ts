import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBoxSealDto } from './CreateBoxSealDto';

export class CreateManyBoxSealsDto {
	@ApiProperty({
		type: [CreateBoxSealDto],
		description: 'Lista de sellos a crear',
	})
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateBoxSealDto)
	boxSeals!: CreateBoxSealDto[];
}

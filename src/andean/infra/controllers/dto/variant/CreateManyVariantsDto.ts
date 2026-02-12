import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVariantDto } from './CreateVariantDto';

export class CreateManyVariantsDto {
	@ApiProperty({
		description: 'Lista de variantes a crear',
		type: [CreateVariantDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateVariantDto)
	variants!: CreateVariantDto[];
}

import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodColorDto } from './CreateSuperfoodColorDto';

export class CreateManySuperfoodColorsDto {
	@ApiProperty({
		description: 'Lista de colores superfood a crear',
		type: [CreateSuperfoodColorDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodColorDto)
	superfoodColors!: CreateSuperfoodColorDto[];
}

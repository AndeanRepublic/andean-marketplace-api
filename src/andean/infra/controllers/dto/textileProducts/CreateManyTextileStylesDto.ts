import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextileStyleDto } from './CreateTextileStyleDto';

export class CreateManyTextileStylesDto {
	@ApiProperty({
		description: 'Lista de estilos textiles a crear',
		type: [CreateTextileStyleDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextileStyleDto)
	textileStyles: CreateTextileStyleDto[];
}

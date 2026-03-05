import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextilePrincipalUseDto } from './CreateTextilePrincipalUseDto';

export class CreateManyTextilePrincipalUsesDto {
	@ApiProperty({
		description: 'Lista de usos principales a crear',
		type: [CreateTextilePrincipalUseDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextilePrincipalUseDto)
	textilePrincipalUses: CreateTextilePrincipalUseDto[];
}

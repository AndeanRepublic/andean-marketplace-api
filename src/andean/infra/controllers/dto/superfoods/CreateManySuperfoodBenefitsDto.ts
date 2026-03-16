import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodBenefitDto } from './CreateSuperfoodBenefitDto';

export class CreateManySuperfoodBenefitsDto {
	@ApiProperty({
		description: 'Lista de beneficios de superfood a crear',
		type: [CreateSuperfoodBenefitDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodBenefitDto)
	superfoodBenefits: CreateSuperfoodBenefitDto[];
}

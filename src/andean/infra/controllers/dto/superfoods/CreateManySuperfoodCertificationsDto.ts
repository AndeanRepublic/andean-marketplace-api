import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSuperfoodCertificationDto } from './CreateSuperfoodCertificationDto';

export class CreateManySuperfoodCertificationsDto {
	@ApiProperty({
		description: 'Lista de certificaciones de superfood a crear',
		type: [CreateSuperfoodCertificationDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodCertificationDto)
	superfoodCertifications: CreateSuperfoodCertificationDto[];
}

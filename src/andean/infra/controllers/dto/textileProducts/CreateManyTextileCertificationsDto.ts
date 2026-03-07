import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTextileCertificationDto } from './CreateTextileCertificationDto';

export class CreateManyTextileCertificationsDto {
	@ApiProperty({
		description: 'Lista de certificaciones textiles a crear',
		type: [CreateTextileCertificationDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTextileCertificationDto)
	textileCertifications: CreateTextileCertificationDto[];
}

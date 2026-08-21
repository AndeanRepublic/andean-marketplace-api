import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceCategoryStatus } from 'src/andean/domain/enums/ExperienceCategoryStatus';

export class CreateExperienceCategoryDto {
	@ApiProperty({
		description: 'Nombre de la categoría de experiencia',
		example: 'Adventure Tourism',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiPropertyOptional({
		description: 'Estado de la categoría',
		enum: ExperienceCategoryStatus,
		default: ExperienceCategoryStatus.ENABLED,
	})
	@IsEnum(ExperienceCategoryStatus)
	@IsOptional()
	status?: ExperienceCategoryStatus;
}

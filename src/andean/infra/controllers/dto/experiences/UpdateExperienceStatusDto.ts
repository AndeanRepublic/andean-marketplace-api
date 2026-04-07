import { IsEnum, IsNotEmpty } from 'class-validator';
import { ExperienceStatus } from '../../../../domain/enums/ExperienceStatus';

export class UpdateExperienceStatusDto {
	@IsEnum(ExperienceStatus)
	@IsNotEmpty()
	status: ExperienceStatus;
}

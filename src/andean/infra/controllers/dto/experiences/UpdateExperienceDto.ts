import { PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './CreateExperienceDto';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

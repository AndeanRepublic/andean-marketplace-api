import { PartialType } from '@nestjs/swagger';
import { CreateCommunityDto } from './CreateCommunityDto';

export class UpdateCommunityDto extends PartialType(CreateCommunityDto) { }

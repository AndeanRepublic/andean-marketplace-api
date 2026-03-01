import { PartialType } from '@nestjs/swagger';
import { CreateMediaItemDto } from './CreateMediaItemDto';

export class UpdateMediaItemDto extends PartialType(CreateMediaItemDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateOriginProductRegionDto } from './CreateOriginProductRegionDto';

export class UpdateOriginProductRegionDto extends PartialType(CreateOriginProductRegionDto) { }

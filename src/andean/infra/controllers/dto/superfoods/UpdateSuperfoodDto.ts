import { PartialType } from '@nestjs/swagger';
import { CreateSuperfoodDto } from './CreateSuperfoodDto';

export class UpdateSuperfoodDto extends PartialType(CreateSuperfoodDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateBoxSealDto } from './CreateBoxSealDto';

export class UpdateBoxSealDto extends PartialType(CreateBoxSealDto) {}

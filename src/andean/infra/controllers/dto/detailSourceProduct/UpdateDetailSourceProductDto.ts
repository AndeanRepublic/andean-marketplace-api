import { PartialType } from '@nestjs/swagger';
import { CreateDetailSourceProductDto } from './CreateDetailSourceProductDto';

export class UpdateDetailSourceProductDto extends PartialType(
	CreateDetailSourceProductDto,
) { }

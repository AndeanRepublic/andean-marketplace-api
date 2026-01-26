import { PartialType } from '@nestjs/swagger';
import { CreateProductTraceabilityDto } from './CreateProductTraceabilityDto';

export class UpdateProductTraceabilityDto extends PartialType(
	CreateProductTraceabilityDto,
) {}

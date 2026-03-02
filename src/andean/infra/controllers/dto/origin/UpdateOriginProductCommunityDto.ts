import { PartialType } from '@nestjs/swagger';
import { CreateOriginProductCommunityDto } from './CreateOriginProductCommunityDto';

export class UpdateOriginProductCommunityDto extends PartialType(
	CreateOriginProductCommunityDto,
) {}

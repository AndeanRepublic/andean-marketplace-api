import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOriginProductCommunityDto } from './CreateOriginProductCommunityDto';

export class CreateManyOriginProductCommunitiesDto {
	@ApiProperty({
		description: 'Lista de comunidades de origen a crear',
		type: [CreateOriginProductCommunityDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOriginProductCommunityDto)
	originProductCommunities: CreateOriginProductCommunityDto[];
}

import {
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { CreateManyOriginProductCommunitiesDto } from 'src/andean/infra/controllers/dto/origin/CreateManyOriginProductCommunitiesDto';
import { OriginProductCommunity } from 'src/andean/domain/entities/origin/OriginProductCommunity';
import { OriginProductCommunityMapper } from 'src/andean/infra/services/OriginProductCommunityMapper';

@Injectable()
export class CreateManyOriginProductCommunitiesUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
		private readonly regionRepository: OriginProductRegionRepository,
	) {}

	async execute(
		dto: CreateManyOriginProductCommunitiesDto,
	): Promise<OriginProductCommunity[]> {
		const uniqueRegionIds = [
			...new Set(
				dto.originProductCommunities.map((c) => c.regionId),
			),
		];
		for (const regionId of uniqueRegionIds) {
			const region = await this.regionRepository.getById(regionId);
			if (!region) {
				throw new NotFoundException(
					`Region with id ${regionId} not found`,
				);
			}
		}

		const communitiesToSave = dto.originProductCommunities.map((itemDto) =>
			OriginProductCommunityMapper.fromCreateDto(itemDto),
		);
		return this.communityRepository.createMany(communitiesToSave);
	}
}

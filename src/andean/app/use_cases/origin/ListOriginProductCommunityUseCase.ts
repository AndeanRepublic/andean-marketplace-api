import { Injectable } from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OriginProductCommunity } from '../../../domain/entities/origin/OriginProductCommunity';

@Injectable()
export class ListOriginProductCommunityUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
	) { }

	async execute(regionId?: string): Promise<OriginProductCommunity[]> {
		if (regionId) {
			return await this.communityRepository.findByRegionId(regionId);
		}
		return await this.communityRepository.findAll();
	}
}

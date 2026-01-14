import { Injectable, NotFoundException } from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OriginProductCommunity } from '../../../domain/entities/origin/OriginProductCommunity';

@Injectable()
export class GetOriginProductCommunityByIdUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
	) { }

	async execute(id: string): Promise<OriginProductCommunity> {
		const community = await this.communityRepository.findById(id);

		if (!community) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		return community;
	}
}

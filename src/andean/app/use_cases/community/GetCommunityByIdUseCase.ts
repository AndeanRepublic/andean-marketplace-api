import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { Community } from '../../../domain/entities/community/Community';

@Injectable()
export class GetCommunityByIdUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
	) { }

	async execute(id: string): Promise<Community> {
		const community = await this.communityRepository.getById(id);

		if (!community) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		return community;
	}
}

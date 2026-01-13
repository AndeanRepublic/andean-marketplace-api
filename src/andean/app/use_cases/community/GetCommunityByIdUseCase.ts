import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommunityRepository } from '../../datastore/community.repository.interface';
import { Community } from '../../../domain/entities/community/Community';

@Injectable()
export class GetCommunityByIdUseCase {
	constructor(
		private readonly communityRepository: ICommunityRepository,
	) { }

	async execute(id: string): Promise<Community> {
		const community = await this.communityRepository.findById(id);

		if (!community) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		return community;
	}
}

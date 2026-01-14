import { Injectable } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community.repo';
import { Community } from '../../../domain/entities/community/Community';

@Injectable()
export class ListCommunityUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
	) { }

	async execute(): Promise<Community[]> {
		return await this.communityRepository.findAll();
	}
}

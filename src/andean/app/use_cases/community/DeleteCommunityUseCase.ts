import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';

@Injectable()
export class DeleteCommunityUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
	) { }

	async execute(id: string): Promise<void> {
		const existing = await this.communityRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		const deleted = await this.communityRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Community');
		}
	}
}

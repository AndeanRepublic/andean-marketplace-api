import { Injectable, NotFoundException } from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';

@Injectable()
export class DeleteOriginProductCommunityUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
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

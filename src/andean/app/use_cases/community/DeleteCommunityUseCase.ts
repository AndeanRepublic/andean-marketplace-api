import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommunityRepository } from '../../datastore/community.repository.interface';

@Injectable()
export class DeleteCommunityUseCase {
	constructor(
		private readonly communityRepository: ICommunityRepository,
	) { }

	async execute(id: string): Promise<void> {
		const existing = await this.communityRepository.findById(id);

		if (!existing) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		const deleted = await this.communityRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Community');
		}
	}
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

@Injectable()
export class UpdateCommunityStatusUseCase {
	constructor(private readonly communityRepository: CommunityRepository) {}

	async execute(id: string, status: AdminEntityStatus) {
		const updated = await this.communityRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException(`Community with id ${id} not found`);
		return updated;
	}
}

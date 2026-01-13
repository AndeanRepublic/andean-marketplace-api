import { Injectable } from '@nestjs/common';
import { ICommunityRepository } from '../../datastore/community.repository.interface';
import { Community } from '../../../domain/entities/community/Community';

@Injectable()
export class ListCommunityUseCase {
	constructor(
		private readonly communityRepository: ICommunityRepository,
	) { }

	async execute(): Promise<Community[]> {
		return await this.communityRepository.findAll();
	}
}

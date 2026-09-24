import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { CommunityPageInfoRepository } from '../../datastore/community/CommunityPageInfo.repo';
import { Community } from '../../../domain/entities/community/Community';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { CommunityPageInfo } from '../../../domain/entities/community/CommunityPageInfo';

export type CommunityWithRelations = Community & {
	providerInfo?: ProviderInfo;
	pageInfo?: CommunityPageInfo;
};

@Injectable()
export class GetCommunityByIdUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		@Inject(CommunityPageInfoRepository)
		private readonly communityPageInfoRepository: CommunityPageInfoRepository,
	) {}

	async execute(id: string): Promise<CommunityWithRelations> {
		const community = await this.communityRepository.getById(id);

		if (!community) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		let providerInfo: ProviderInfo | undefined;
		if (community.providerInfoId) {
			const found = await this.providerInfoRepository.getById(
				community.providerInfoId,
			);
			providerInfo = found ?? undefined;
		}

		let pageInfo: CommunityPageInfo | undefined;
		if (community.pageInfoId) {
			const found = await this.communityPageInfoRepository.getById(
				community.pageInfoId,
			);
			pageInfo = found ?? undefined;
		}

		return { ...community, providerInfo, pageInfo };
	}
}

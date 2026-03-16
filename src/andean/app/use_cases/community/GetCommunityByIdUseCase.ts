import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { Community } from '../../../domain/entities/community/Community';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';

export type CommunityWithProviderInfo = Community & {
	providerInfo?: ProviderInfo;
};

@Injectable()
export class GetCommunityByIdUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
	) {}

	async execute(id: string): Promise<CommunityWithProviderInfo> {
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

		return { ...community, providerInfo };
	}
}

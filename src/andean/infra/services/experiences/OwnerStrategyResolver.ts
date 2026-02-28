import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { CommunityRepository } from 'src/andean/app/datastore/community/community.repo';

export interface OwnerResolverStrategy {
	validate(ownerId: string): Promise<void>;
	getOwnerName(ownerId: string): Promise<string>;
	getOwnerNames(ownerIds: string[]): Promise<Map<string, string>>;
}

export class CommunityOwnerStrategy implements OwnerResolverStrategy {
	constructor(private readonly communityRepository: CommunityRepository) {}

	async validate(ownerId: string): Promise<void> {
		const community = await this.communityRepository.getById(ownerId);
		if (!community) {
			throw new NotFoundException('Community not found');
		}
	}

	async getOwnerName(ownerId: string): Promise<string> {
		const community = await this.communityRepository.getById(ownerId);
		return community?.name || '';
	}

	async getOwnerNames(ownerIds: string[]): Promise<Map<string, string>> {
		const communities = await this.communityRepository.getByIds(ownerIds);
		const map = new Map<string, string>();
		communities.forEach((c) => map.set(c.id, c.name));
		return map;
	}
}

@Injectable()
export class OwnerStrategyResolver {
	private strategies: Map<OwnerType, OwnerResolverStrategy>;

	constructor(
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) {
		this.strategies = new Map();
		this.strategies.set(
			OwnerType.COMMUNITY,
			new CommunityOwnerStrategy(communityRepository),
		);
	}

	resolve(ownerType: OwnerType): OwnerResolverStrategy {
		const strategy = this.strategies.get(ownerType);
		if (!strategy) {
			throw new BadRequestException(`Unsupported owner type: ${ownerType}`);
		}
		return strategy;
	}
}

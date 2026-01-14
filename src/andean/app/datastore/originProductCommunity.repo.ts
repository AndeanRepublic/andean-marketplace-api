import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';

export abstract class OriginProductCommunityRepository {
	abstract create(community: OriginProductCommunity): Promise<OriginProductCommunity>;
	abstract findById(id: string): Promise<OriginProductCommunity | null>;
	abstract findAll(): Promise<OriginProductCommunity[]>;
	abstract findByName(name: string): Promise<OriginProductCommunity | null>;
	abstract findByRegionId(regionId: string): Promise<OriginProductCommunity[]>;
	abstract update(
		id: string,
		community: Partial<OriginProductCommunity>,
	): Promise<OriginProductCommunity | null>;
	abstract delete(id: string): Promise<boolean>;
}

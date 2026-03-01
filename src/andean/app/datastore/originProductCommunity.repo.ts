import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';

export abstract class OriginProductCommunityRepository {
	abstract create(
		community: OriginProductCommunity,
	): Promise<OriginProductCommunity>;
	abstract getById(id: string): Promise<OriginProductCommunity | null>;
	abstract getAll(): Promise<OriginProductCommunity[]>;
	abstract getByName(name: string): Promise<OriginProductCommunity | null>;
	abstract getByRegionId(regionId: string): Promise<OriginProductCommunity[]>;
	abstract update(
		id: string,
		community: Partial<OriginProductCommunity>,
	): Promise<OriginProductCommunity | null>;
	abstract delete(id: string): Promise<boolean>;
}

import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';

export abstract class OriginProductRegionRepository {
	abstract create(region: OriginProductRegion): Promise<OriginProductRegion>;
	abstract findById(id: string): Promise<OriginProductRegion | null>;
	abstract findAll(): Promise<OriginProductRegion[]>;
	abstract findByName(name: string): Promise<OriginProductRegion | null>;
	abstract update(
		id: string,
		region: Partial<OriginProductRegion>,
	): Promise<OriginProductRegion | null>;
	abstract delete(id: string): Promise<boolean>;
}

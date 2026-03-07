import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';

export abstract class OriginProductRegionRepository {
	abstract create(region: OriginProductRegion): Promise<OriginProductRegion>;
	abstract createMany(
		regions: OriginProductRegion[],
	): Promise<OriginProductRegion[]>;
	abstract getById(id: string): Promise<OriginProductRegion | null>;
	abstract getAll(): Promise<OriginProductRegion[]>;
	abstract getByName(name: string): Promise<OriginProductRegion | null>;
	abstract update(
		id: string,
		region: Partial<OriginProductRegion>,
	): Promise<OriginProductRegion | null>;
	abstract delete(id: string): Promise<boolean>;
}

import { Community } from '../../domain/entities/community/Community';

export abstract class CommunityRepository {
	abstract create(community: Community): Promise<Community>;
	abstract getById(id: string): Promise<Community | null>;
	abstract getAll(): Promise<Community[]>;
	abstract getByName(name: string): Promise<Community | null>;
	abstract update(
		id: string,
		community: Partial<Community>,
	): Promise<Community | null>;
	abstract delete(id: string): Promise<boolean>;
}

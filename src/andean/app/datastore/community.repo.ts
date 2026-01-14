import { Community } from '../../domain/entities/community/Community';

export abstract class CommunityRepository {
	abstract create(community: Community): Promise<Community>;
	abstract findById(id: string): Promise<Community | null>;
	abstract findAll(): Promise<Community[]>;
	abstract findByName(name: string): Promise<Community | null>;
	abstract update(
		id: string,
		community: Partial<Community>,
	): Promise<Community | null>;
	abstract delete(id: string): Promise<boolean>;
}

import { Community } from '../../domain/entities/community/Community';

export interface ICommunityRepository {
	create(community: Community): Promise<Community>;
	findById(id: string): Promise<Community | null>;
	findAll(): Promise<Community[]>;
	findByName(name: string): Promise<Community | null>;
	update(id: string, community: Partial<Community>): Promise<Community | null>;
	delete(id: string): Promise<boolean>;
}

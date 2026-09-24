import { CommunityPageInfo } from '../../../domain/entities/community/CommunityPageInfo';

export abstract class CommunityPageInfoRepository {
	abstract create(data: CommunityPageInfo): Promise<CommunityPageInfo>;
	abstract update(id: string, data: Partial<CommunityPageInfo>): Promise<CommunityPageInfo>;
	abstract getById(id: string): Promise<CommunityPageInfo | null>;
}

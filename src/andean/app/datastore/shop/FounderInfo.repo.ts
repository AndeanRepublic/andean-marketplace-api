import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';

export abstract class FounderInfoRepository {
	abstract create(data: FounderInfo): Promise<FounderInfo>;
	abstract update(id: string, data: Partial<FounderInfo>): Promise<FounderInfo>;
	abstract getById(id: string): Promise<FounderInfo | null>;
}

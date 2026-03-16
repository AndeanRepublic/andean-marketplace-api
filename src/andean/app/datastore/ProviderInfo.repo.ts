import { ProviderInfo } from '../../domain/entities/ProviderInfo';

export abstract class ProviderInfoRepository {
	abstract create(providerInfo: ProviderInfo): Promise<ProviderInfo>;
	abstract update(
		id: string,
		data: Partial<ProviderInfo>,
	): Promise<ProviderInfo>;
	abstract getById(id: string): Promise<ProviderInfo | null>;
}

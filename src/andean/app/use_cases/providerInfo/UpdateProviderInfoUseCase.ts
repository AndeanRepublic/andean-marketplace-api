import { Inject, Injectable } from '@nestjs/common';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { CreateProviderInfoDto } from '../../../infra/controllers/dto/providerInfo/CreateProviderInfoDto';
import { ProviderInfoMapper } from '../../../infra/services/ProviderInfoMapper';

@Injectable()
export class UpdateProviderInfoUseCase {
	constructor(
		@Inject(ProviderInfoRepository)
		private readonly repo: ProviderInfoRepository,
	) {}

	async handle(id: string, dto: CreateProviderInfoDto): Promise<ProviderInfo> {
		const data = ProviderInfoMapper.fromUpdateDto(id, dto);
		return this.repo.update(id, data);
	}
}

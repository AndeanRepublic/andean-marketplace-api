import { Inject, Injectable } from '@nestjs/common';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { CreateProviderInfoDto } from '../../../infra/controllers/dto/providerInfo/CreateProviderInfoDto';
import { ProviderInfoMapper } from '../../../infra/services/ProviderInfoMapper';

@Injectable()
export class CreateProviderInfoUseCase {
	constructor(
		@Inject(ProviderInfoRepository)
		private readonly repo: ProviderInfoRepository,
	) {}

	async handle(dto: CreateProviderInfoDto): Promise<ProviderInfo> {
		const providerInfo = ProviderInfoMapper.fromCreateDto(dto);
		return this.repo.create(providerInfo);
	}
}

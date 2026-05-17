import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { UpdateProviderInfoUseCase } from '../providerInfo/UpdateProviderInfoUseCase';
import { UpdateShopDto } from '../../../infra/controllers/dto/shop/UpdateShopDto';
import { SealRepository } from '../../datastore/community/Seal.repo';

@Injectable()
export class UpdateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
		private readonly updateProviderInfoUseCase: UpdateProviderInfoUseCase,
	) {}

	async handle(id: string, dto: UpdateShopDto): Promise<Shop> {
		const existing = await this.shopRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('Shop not found');
		}

		if (dto.seals && dto.seals.length > 0) {
			for (const sealId of dto.seals) {
				const sealFound = await this.sealRepository.getById(sealId);
				if (!sealFound) {
					throw new NotFoundException(`Seal with id ${sealId} not found`);
				}
			}
		}

		let providerInfoId = existing.providerInfoId;
		if (dto.providerInfo) {
			if (existing.providerInfoId) {
				await this.updateProviderInfoUseCase.handle(existing.providerInfoId, dto.providerInfo);
			} else {
				const pi = await this.createProviderInfoUseCase.handle(dto.providerInfo);
				providerInfoId = pi.id;
			}
		}

		const { providerInfo: _pi, ...dtoRest } = dto;
		const updateData: Partial<Shop> = { ...dtoRest, providerInfoId };

		return this.shopRepository.updateShop(id, updateData);
	}
}

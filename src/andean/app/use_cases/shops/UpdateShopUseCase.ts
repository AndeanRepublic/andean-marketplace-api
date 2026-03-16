import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { Shop } from '../../../domain/entities/Shop';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { UpdateProviderInfoUseCase } from '../providerInfo/UpdateProviderInfoUseCase';
import { UpdateShopDto } from '../../../infra/controllers/dto/UpdateShopDto';

@Injectable()
export class UpdateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
		private readonly updateProviderInfoUseCase: UpdateProviderInfoUseCase,
	) {}

	async handle(id: string, dto: UpdateShopDto): Promise<Shop> {
		const existing = await this.shopRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('Shop not found');
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

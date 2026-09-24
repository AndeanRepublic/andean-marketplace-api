import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { ShopPageInfoRepository } from '../../datastore/shop/ShopPageInfo.repo';
import { FounderInfoRepository } from '../../datastore/shop/FounderInfo.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';
import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { UpdateProviderInfoUseCase } from '../providerInfo/UpdateProviderInfoUseCase';
import { UpdateShopDto } from '../../../infra/controllers/dto/shop/UpdateShopDto';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { Types } from 'mongoose';

@Injectable()
export class UpdateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(ShopPageInfoRepository)
		private readonly shopPageInfoRepository: ShopPageInfoRepository,
		@Inject(FounderInfoRepository)
		private readonly founderInfoRepository: FounderInfoRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
		private readonly updateProviderInfoUseCase: UpdateProviderInfoUseCase,
	) {}

	async handle(id: string, dto: UpdateShopDto): Promise<Shop> {
		const existing = await this.shopRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('Shop not found');
		}

		const hasBranding = dto.hasBranding ?? existing.hasBranding ?? true;
		if (!hasBranding) {
			const founderName = dto.founderInfo?.founderName;
			const founderImage = dto.founderInfo?.founderImage;
			if (founderName) dto.name = founderName;
			if (founderImage) dto.imageOrIconMediaId = founderImage;
		}

		if (dto.seals !== undefined) {
			if (dto.seals.length !== 4) {
				throw new BadRequestException('Debes seleccionar exactamente 4 sellos');
			}
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
				await this.updateProviderInfoUseCase.handle(
					existing.providerInfoId,
					dto.providerInfo,
				);
			} else {
				const pi = await this.createProviderInfoUseCase.handle(
					dto.providerInfo,
				);
				providerInfoId = pi.id;
			}
		}

		let pageInfoId = existing.pageInfoId;
		if (dto.pageInfo) {
			if (existing.pageInfoId) {
				await this.shopPageInfoRepository.update(
					existing.pageInfoId,
					dto.pageInfo,
				);
			} else {
				const pageInfoToSave = new ShopPageInfo(
					new Types.ObjectId().toString(),
					dto.pageInfo.tagline,
					dto.pageInfo.shortBio,
					dto.pageInfo.historyImageMediaIds,
					dto.pageInfo.whatWeDoDescription,
					dto.pageInfo.whatWeDoImageMediaIds,
				);
				const created =
					await this.shopPageInfoRepository.create(pageInfoToSave);
				pageInfoId = created.id;
			}
		}

		let founderInfoId = existing.founderInfoId;
		if (dto.founderInfo) {
			if (existing.founderInfoId) {
				await this.founderInfoRepository.update(
					existing.founderInfoId,
					dto.founderInfo,
				);
			} else {
				const founderToSave = new FounderInfo(
					new Types.ObjectId().toString(),
					dto.founderInfo.founderName,
					dto.founderInfo.founderImage,
				);
				const created = await this.founderInfoRepository.create(founderToSave);
				founderInfoId = created.id;
			}
		}

		const {
			providerInfo: _pi,
			pageInfo: _pgInfo,
			founderInfo: _fi,
			...dtoRest
		} = dto;
		const updateData: Partial<Shop> = {
			...dtoRest,
			providerInfoId,
			pageInfoId,
			founderInfoId,
		};

		return this.shopRepository.updateShop(id, updateData);
	}
}

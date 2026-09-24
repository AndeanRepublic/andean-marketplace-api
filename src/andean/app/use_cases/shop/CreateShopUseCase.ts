import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { ShopPageInfoRepository } from '../../datastore/shop/ShopPageInfo.repo';
import { FounderInfoRepository } from '../../datastore/shop/FounderInfo.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/shop/CreateShopDto';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';
import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopMapper } from '../../../infra/services/shop/ShopMapper';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { ShopSellerLinkValidator } from '../../services/ShopSellerLinkValidator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { Types } from 'mongoose';

export type CreateShopOptions = {
	initialStatus?: ShopStatus;
	requestingUserId?: string;
	roles?: AccountRole[];
};

@Injectable()
export class CreateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private sellerRepository: SellerProfileRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(ShopPageInfoRepository)
		private readonly shopPageInfoRepository: ShopPageInfoRepository,
		@Inject(FounderInfoRepository)
		private readonly founderInfoRepository: FounderInfoRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
		private readonly shopSellerLinkValidator: ShopSellerLinkValidator,
	) {}

	async handle(
		shopDto: CreateShopDto,
		options?: CreateShopOptions,
	): Promise<Shop> {
		const initialStatus = options?.initialStatus ?? ShopStatus.PENDING;
		const roles = options?.roles ?? [];
		const isAdmin = roles.includes(AccountRole.ADMIN);
		const isSellerOnly = roles.includes(AccountRole.SELLER) && !isAdmin;

		let dtoForShop = applyFounderIdentity({ ...shopDto });

		if (isSellerOnly && options?.requestingUserId) {
			const sellerProfile = await this.sellerRepository.getSellerByUserId(
				options.requestingUserId,
			);
			if (!sellerProfile) {
				throw new ForbiddenException('Seller profile not found');
			}
			if (sellerProfile.status !== SellerStatus.APPROVED) {
				throw new ForbiddenException(
					'Seller profile must be approved before creating a shop',
				);
			}
			if (dtoForShop.sellerId && dtoForShop.sellerId !== sellerProfile.id) {
				throw new ForbiddenException(
					'You can only create a shop for your own seller profile',
				);
			}
			if (!dtoForShop.sellerId) {
				dtoForShop = { ...dtoForShop, sellerId: sellerProfile.id };
			}
		}

		if (dtoForShop.sellerId) {
			const sellerFound = await this.sellerRepository.getSellerById(
				dtoForShop.sellerId,
			);
			if (!sellerFound) {
				throw new NotFoundException('Seller not found');
			}
			await this.shopSellerLinkValidator.assertSellerHasNoShop(
				dtoForShop.sellerId,
			);
		}

		if (!shopDto.seals || shopDto.seals.length !== 4) {
			throw new BadRequestException('Debes seleccionar exactamente 4 sellos');
		}

		for (const sealId of shopDto.seals) {
			const sealFound = await this.sealRepository.getById(sealId);
			if (!sealFound) {
				throw new NotFoundException(`Seal with id ${sealId} not found`);
			}
		}

		let providerInfoId: string | undefined;
		if (shopDto.providerInfo) {
			const created = await this.createProviderInfoUseCase.handle(
				shopDto.providerInfo,
			);
			providerInfoId = created.id;
		}

		let pageInfoId: string | undefined;
		if (shopDto.pageInfo) {
			const pageInfoToSave = new ShopPageInfo(
				new Types.ObjectId().toString(),
				shopDto.pageInfo.tagline,
				shopDto.pageInfo.shortBio,
				shopDto.pageInfo.historyImageMediaIds,
				shopDto.pageInfo.whatWeDoDescription,
				shopDto.pageInfo.whatWeDoImageMediaIds,
			);
			const created = await this.shopPageInfoRepository.create(pageInfoToSave);
			pageInfoId = created.id;
		}

		let founderInfoId: string | undefined;
		if (shopDto.founderInfo) {
			const founderToSave = new FounderInfo(
				new Types.ObjectId().toString(),
				shopDto.founderInfo.founderName,
				shopDto.founderInfo.founderImage,
			);
			const created = await this.founderInfoRepository.create(founderToSave);
			founderInfoId = created.id;
		}

		const shopPayload = {
			...dtoForShop,
			providerInfoId,
			activePage: shopDto.activePage ?? false,
			pageInfoId,
			founderInfoId,
		};
		delete (shopPayload as any).providerInfo;
		delete (shopPayload as any).pageInfo;
		delete (shopPayload as any).founderInfo;
		const shopToSave = ShopMapper.fromCreateDto(shopPayload, initialStatus);
		return this.shopRepository.saveShop(shopToSave);
	}
}

function applyFounderIdentity(dto: CreateShopDto): CreateShopDto {
	if (dto.hasBranding !== false || !dto.founderInfo) return dto;
	return {
		...dto,
		name: dto.name?.trim() || dto.founderInfo.founderName,
		imageOrIconMediaId: dto.imageOrIconMediaId || dto.founderInfo.founderImage,
	};
}

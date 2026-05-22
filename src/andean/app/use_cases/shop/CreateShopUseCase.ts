import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/shop/CreateShopDto';
import { Shop } from '../../../domain/entities/shop/Shop';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopMapper } from '../../../infra/services/shop/ShopMapper';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { ShopSellerLinkValidator } from '../../services/ShopSellerLinkValidator';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerStatus } from '../../../domain/enums/SellerStatus';

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
		const isSellerOnly =
			roles.includes(AccountRole.SELLER) && !isAdmin;

		let dtoForShop = { ...shopDto };

		if (isSellerOnly && options?.requestingUserId) {
			const sellerProfile =
				await this.sellerRepository.getSellerByUserId(
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

		if (shopDto.seals && shopDto.seals.length > 0) {
			for (const sealId of shopDto.seals) {
				const sealFound = await this.sealRepository.getById(sealId);
				if (!sealFound) {
					throw new NotFoundException(`Seal with id ${sealId} not found`);
				}
			}
		}

		// Crear ProviderInfo si viene embebido y asignar su id
		let providerInfoId: string | undefined;
		if (shopDto.providerInfo) {
			const created = await this.createProviderInfoUseCase.handle(
				shopDto.providerInfo,
			);
			providerInfoId = created.id;
		}

		const shopPayload = { ...dtoForShop, providerInfoId };
		delete (shopPayload as any).providerInfo;
		const shopToSave = ShopMapper.fromCreateDto(shopPayload, initialStatus);
		return this.shopRepository.saveShop(shopToSave);
	}
}

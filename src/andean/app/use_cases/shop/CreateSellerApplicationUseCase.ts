import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { CreateSellerApplicationDto } from '../../../infra/controllers/dto/shop/CreateSellerApplicationDto';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { CreateSellerUseCase } from '../users/CreateSellerUseCase';
import { ShopMapper } from '../../../infra/services/shop/ShopMapper';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { AccountRepository } from '../../datastore/Account.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerStatus } from '../../../domain/enums/SellerStatus';

export type SellerApplicationResult = {
	seller: SellerProfile;
	shop: Shop;
};

const BLOCKING_SHOP_STATUSES = new Set<ShopStatus>([
	ShopStatus.PENDING,
	ShopStatus.ACTIVE,
	ShopStatus.DEACTIVATED,
]);

@Injectable()
export class CreateSellerApplicationUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		private readonly createSellerUseCase: CreateSellerUseCase,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
	) {}

	async handle(
		userId: string,
		dto: CreateSellerApplicationDto,
	): Promise<SellerApplicationResult> {
		await this.assertUserCanSubmitSellerApplication(userId);

		const sellerDto: CreateSellerDto = {
			userId,
			...dto.seller,
		};
		const seller = await this.createSellerUseCase.handle(sellerDto);

		if (dto.seals && dto.seals.length > 0) {
			for (const sealId of dto.seals) {
				const sealFound = await this.sealRepository.getById(sealId);
				if (!sealFound) {
					throw new NotFoundException(`Seal with id ${sealId} not found`);
				}
			}
		}

		let providerInfoId: string | undefined;
		if (dto.providerInfo) {
			const created = await this.createProviderInfoUseCase.handle(
				dto.providerInfo,
			);
			providerInfoId = created.id;
		}

		const existingShops = await this.shopRepository.getAllBySellerId(seller.id);
		const rejectedShop = existingShops.find(
			(s) => s.status === ShopStatus.REJECTED,
		);

		let shop: Shop;
		if (rejectedShop) {
			shop = await this.shopRepository.updateShop(rejectedShop.id, {
				name: dto.name,
				categories: dto.categories,
				artisanPhotoMediaId: dto.artisanPhotoMediaId,
				providerInfoId,
				seals: dto.seals,
				status: ShopStatus.PENDING,
			});
		} else {
			const pendingShop = existingShops.find(
				(s) => s.status === ShopStatus.PENDING,
			);
			if (pendingShop) {
				throw new ConflictException(
					'Ya existe una tienda pendiente de revisión para este vendedor',
				);
			}

			const shopToSave = ShopMapper.fromCreateDto({
				sellerId: seller.id,
				name: dto.name,
				categories: dto.categories,
				artisanPhotoMediaId: dto.artisanPhotoMediaId,
				providerInfoId,
				seals: dto.seals,
			});
			shop = await this.shopRepository.saveShop(shopToSave);
		}

		return { seller, shop };
	}

	private async assertUserCanSubmitSellerApplication(
		userId: string,
	): Promise<void> {
		const account = await this.accountRepository.getAccountById(userId);
		if (!account) {
			throw new ConflictException('Usuario no encontrado');
		}

		if (account.roles.includes(AccountRole.SELLER)) {
			throw new ConflictException(
				'Ya eres vendedor registrado. No puedes enviar una nueva solicitud.',
			);
		}

		const sellerProfile = await this.sellerRepository.getSellerByUserId(userId);
		if (!sellerProfile) {
			return;
		}

		if (
			sellerProfile.status === SellerStatus.PENDING ||
			sellerProfile.status === SellerStatus.APPROVED
		) {
			throw new ConflictException(
				'Ya existe una solicitud o perfil de vendedor activo',
			);
		}

		const shops = await this.shopRepository.getAllBySellerId(sellerProfile.id);
		const hasBlockingShop = shops.some((shop) =>
			BLOCKING_SHOP_STATUSES.has(shop.status),
		);
		if (hasBlockingShop) {
			throw new ConflictException(
				'Ya tienes una tienda asignada o pendiente de revisión',
			);
		}
	}

	static toSellerProfileResponse(seller: SellerProfile) {
		return SellerProfileMapper.toResponse(seller);
	}
}

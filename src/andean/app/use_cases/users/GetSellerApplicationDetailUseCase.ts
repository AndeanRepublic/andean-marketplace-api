import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { Shop } from '../../../domain/entities/shop/Shop';
import {
	SellerApplicationDetailResponse,
	SellerApplicationShopDetail,
} from '../../models/shop/SellerApplicationDetailResponse';

@Injectable()
export class GetSellerApplicationDetailUseCase {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(userId: string): Promise<SellerApplicationDetailResponse> {
		if (!isValidObjectId(userId)) {
			throw new BadRequestException('Invalid user ID');
		}

		const profile = await this.sellerRepository.getSellerByUserId(userId);
		if (!profile) {
			throw new NotFoundException('Seller profile not found');
		}

		if (profile.status !== SellerStatus.PENDING) {
			throw new BadRequestException(
				'La solicitud solo está disponible cuando el vendedor está en estado PENDING',
			);
		}

		const shops = await this.shopRepository.getAllBySellerId(profile.id);
		const pendingShops = shops.filter((s) => s.status === ShopStatus.PENDING);
		if (pendingShops.length === 0) {
			throw new BadRequestException(
				'No hay tiendas pendientes de revisión para este vendedor',
			);
		}

		const account = await this.accountRepository.getAccountById(userId);
		if (!account) {
			throw new NotFoundException('Account not found');
		}

		const shopDetails = await Promise.all(
			pendingShops.map((shop) => this.buildShopDetail(shop)),
		);

		return {
			seller: SellerProfileMapper.toResponse(profile),
			account: {
				email: account.email,
				name: account.name,
			},
			shops: shopDetails,
		};
	}

	private async buildShopDetail(shop: Shop): Promise<SellerApplicationShopDetail> {
		let providerInfo: Record<string, unknown> | undefined;
		if (shop.providerInfoId) {
			const found = await this.providerInfoRepository.getById(
				shop.providerInfoId,
			);
			if (found) {
				providerInfo = await this.providerInfoToPlain(found);
			}
		}

		const seals = await this.resolveSeals(shop.seals ?? []);

		return {
			id: shop.id,
			sellerId: shop.sellerId,
			name: shop.name,
			status: shop.status,
			categories: shop.categories,
			providerInfoId: shop.providerInfoId,
			artisanPhotoMediaId: shop.artisanPhotoMediaId,
			artisanPhotoUrl: await this.mediaUrlResolver.resolveUrl(
				shop.artisanPhotoMediaId,
			),
			seals,
			providerInfo,
		};
	}

	private async resolveSeals(
		sealIds: string[],
	): Promise<{ id: string; name: string }[]> {
		const result: { id: string; name: string }[] = [];
		for (const id of sealIds) {
			const seal = await this.sealRepository.getById(id);
			if (seal) {
				result.push({ id: seal.id, name: seal.name });
			}
		}
		return result;
	}

	private async providerInfoToPlain(
		p: ProviderInfo,
	): Promise<Record<string, unknown>> {
		const workplacePhotoUrl = await this.mediaUrlResolver.resolveUrl(
			p.workplacePhotoMediaId,
		);
		const presentationVideoUrl = await this.mediaUrlResolver.resolveUrl(
			p.presentationVideoMediaId,
		);

		return {
			craftType: p.craftType,
			tagline: p.tagline,
			shortBio: p.shortBio,
			originPlace: p.originPlace,
			testimonialsOrAwards: p.testimonialsOrAwards,
			workplacePhotoMediaId: p.workplacePhotoMediaId,
			workplacePhotoUrl,
			presentationVideoMediaId: p.presentationVideoMediaId,
			presentationVideoUrl,
			isPartOfOrganization: p.isPartOfOrganization,
			organizationName: p.organizationName,
			memberCount: p.memberCount,
			exactLocation: p.exactLocation,
			contactAddress: p.contactAddress,
			contactPhone: p.contactPhone,
			contactEmail: p.contactEmail,
			spokenLanguages: p.spokenLanguages,
			hasInternetAccess: p.hasInternetAccess,
			connectionTypes: p.connectionTypes,
			extendedStory: p.extendedStory,
			foundingYear: p.foundingYear,
			projectTimeline: p.projectTimeline,
			womenArtisanPercentage: p.womenArtisanPercentage,
			includesPeopleWithDisabilities: p.includesPeopleWithDisabilities,
			hasYouthInvolvement: p.hasYouthInvolvement,
			indirectBeneficiaryChildren: p.indirectBeneficiaryChildren,
			averageArtisanAge: p.averageArtisanAge,
			parallelActivities: p.parallelActivities,
			programParticipation: p.programParticipation,
			trainingReceived: p.trainingReceived,
		};
	}
}

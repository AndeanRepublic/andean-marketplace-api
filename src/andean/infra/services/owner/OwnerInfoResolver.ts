import { Inject, Injectable, Optional } from '@nestjs/common';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { ShopRepository } from 'src/andean/app/datastore/Shop.repo';
import { CommunityRepository } from 'src/andean/app/datastore/community/community.repo';
import { SealRepository } from 'src/andean/app/datastore/community/Seal.repo';
import { ProviderInfoRepository } from 'src/andean/app/datastore/ProviderInfo.repo';
import { OwnerInfoResponse } from 'src/andean/app/models/textile/TextileProductDetailResponse';
import { MediaUrlResolver } from '../media/MediaUrlResolver';

@Injectable()
export class OwnerInfoResolver {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
		@Optional()
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository?: ProviderInfoRepository,
	) {}

	async resolveDetailed(
		ownerType: OwnerType | string,
		ownerId: string,
	): Promise<OwnerInfoResponse | undefined> {
		if (ownerType === OwnerType.COMMUNITY) {
			const community = await this.communityRepository.getById(ownerId);
			if (!community) return undefined;

			const bannerImageUrl = await this.mediaUrlResolver.resolveUrl(
				community.bannerImageId,
			);
			const seals = community.seals
				? await Promise.all(
						community.seals.map((sealId) =>
							this.sealRepository.getById(sealId),
						),
					)
				: [];

			const validSeals = seals.filter(
				(seal): seal is NonNullable<typeof seal> => seal !== null,
			);
			const sealLogoUrls = await this.mediaUrlResolver.resolveUrls(
				validSeals.map((seal) => seal.logoMediaId).filter(Boolean),
			);

			return {
				ownerType: OwnerType.COMMUNITY,
				community: {
					bannerImageUrl,
					name: community.name,
					seals: validSeals.map((seal) => ({
						title: seal.name,
						description: seal.description,
						logoMediaId: seal.logoMediaId,
						logoUrl: sealLogoUrls.get(seal.logoMediaId) ?? '',
					})),
				},
			};
		}

		const shop = await this.shopRepository.getById(ownerId);
		if (!shop) return undefined;

		const ownerImage = await this.mediaUrlResolver.resolveUrl(
			shop.artisanPhotoMediaId,
		);
		let originPlace = '';
		if (shop.providerInfoId && this.providerInfoRepository) {
			const providerInfo = await this.providerInfoRepository.getById(
				shop.providerInfoId,
			);
			originPlace = providerInfo?.originPlace ?? '';
		}

		return {
			ownerType: OwnerType.SHOP,
			shop: {
				ownerImage,
				shopName: shop.name,
				originPlace,
				seals: [],
			},
		};
	}
}

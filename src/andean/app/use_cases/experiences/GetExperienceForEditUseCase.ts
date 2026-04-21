import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';
import { MediaUrlResolver } from 'src/andean/infra/services/media/MediaUrlResolver';

function toDateOnlyString(d: Date): string {
	return d.toISOString().split('T')[0]!;
}

export type ExperienceForEditPayload = Record<string, unknown>;

@Injectable()
export class GetExperienceForEditUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperiencePricesRepository)
		private readonly pricesRepository: ExperiencePricesRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepository: ExperienceAvailabilityRepository,
		@Inject(ExperienceItineraryRepository)
		private readonly itineraryRepository: ExperienceItineraryRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(
		experienceId: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<ExperienceForEditPayload> {
		const experience = await this.experienceRepository.getById(experienceId);
		if (!experience) {
			throw new NotFoundException('Experience not found');
		}

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			experience.basicInfo.ownerType,
			experience.basicInfo.ownerId,
		);

		const [prices, availability, itineraries] = await Promise.all([
			this.pricesRepository.getById(experience.pricesId),
			this.availabilityRepository.getById(experience.availabilityId),
			experience.itineraryIds.length
				? this.itineraryRepository.getByIds(experience.itineraryIds)
				: Promise.resolve([]),
		]);

		if (!prices || !availability) {
			throw new NotFoundException('Experience sub-resources not found');
		}

		const media = experience.mediaInfo;
		const mediaIds = [
			media.landscapeImg,
			media.thumbnailImg,
			...(media.photos ?? []),
			...(media.videos ?? []),
			...(media.ubicationImg ? [media.ubicationImg] : []),
			...itineraries.flatMap((it) => it.photos ?? []),
		];
		const urlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);
		const preview: Record<string, string> = {};
		for (const id of mediaIds) {
			const u = urlMap.get(id);
			if (u) preview[id] = u;
		}

		const sortedItineraries = [...itineraries].sort(
			(a, b) => a.numberDay - b.numberDay,
		);

		return {
			id: experience.id,
			status: experience.status,
			basicInfo: {
				title: experience.basicInfo.title,
				ubication: experience.basicInfo.ubication,
				days: experience.basicInfo.days,
				nights: experience.basicInfo.nights,
				minNumberGroup: experience.basicInfo.minNumberGroup,
				maxNumberGroup: experience.basicInfo.maxNumberGroup,
				languages: experience.basicInfo.languages,
				ownerType: experience.basicInfo.ownerType,
				ownerId: experience.basicInfo.ownerId,
				category: experience.basicInfo.category,
			},
			mediaInfo: {
				landscapeImg: media.landscapeImg,
				thumbnailImg: media.thumbnailImg,
				photos: media.photos ?? [],
				videos: media.videos ?? [],
				ubicationImg: media.ubicationImg,
			},
			detailInfo: {
				shortDescription: experience.detailInfo.shortDescription,
				largeDescription: experience.detailInfo.largeDescription,
				includes: experience.detailInfo.includes,
				notIncludes: experience.detailInfo.notIncludes,
				pickupDetail: experience.detailInfo.pickupDetail,
				returnDetail: experience.detailInfo.returnDetail,
				accommodationDetail: experience.detailInfo.accommodationDetail,
				accessibilityDetail: experience.detailInfo.accessibilityDetail,
				cancellationPolicy: experience.detailInfo.cancellationPolicy,
				shouldCarry: experience.detailInfo.shouldCarry,
				aditionalInformation: experience.detailInfo.aditionalInformation,
				contactNumber: experience.detailInfo.contactNumber,
			},
			prices: {
				useAgeBasedPricing: prices.useAgeBasedPricing,
				currency: prices.currency,
				ageGroups: prices.ageGroups.map((g) => ({
					code: g.code,
					label: g.label,
					price: g.price,
					minAge: g.minAge,
					maxAge: g.maxAge,
				})),
			},
			availability: {
				mode: availability.mode,
				weeklyStartDays: availability.weeklyStartDays,
				specificAvailableStartDates:
					availability.specificAvailableStartDates.map(toDateOnlyString),
				excludedDates: availability.excludedDates.map(toDateOnlyString),
			},
			itineraries: sortedItineraries.map((it) => ({
				numberDay: it.numberDay,
				nameDay: it.nameDay,
				descriptionDay: it.descriptionDay,
				photos: it.photos ?? [],
				schedule: it.schedule.map((s) => ({
					time: s.time,
					activity: s.activity,
				})),
			})),
			mediaPreviewUrls: preview,
		};
	}
}

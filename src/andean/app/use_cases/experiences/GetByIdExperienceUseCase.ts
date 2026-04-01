import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { ReviewRepository } from '../../datastore/Review.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { BookingRepository } from '../../datastore/booking/Booking.repo';

import { MediaItem } from '../../../domain/entities/MediaItem';
import { Review } from '../../../domain/entities/Review';
import { ProductType } from '../../../domain/enums/ProductType';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { ExperienceAvailabilityMode } from '../../../domain/enums/ExperienceAvailabilityMode';

import {
	ExperienceAvailabilityResponse,
	ExperienceDetailResponse,
} from '../../models/experiences/ExperienceDetailResponse';
import { ExperienceDetailMapper } from '../../../infra/services/experiences/ExperienceDetailMapper';
import { GetFutureUnavailableDatesUseCase } from './GetFutureUnavailableDatesUseCase';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { OwnerInfoResolver } from '../../../infra/services/owner/OwnerInfoResolver';

@Injectable()
export class GetByIdExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepo: ExperienceRepository,
		@Inject(ExperiencePricesRepository)
		private readonly pricesRepo: ExperiencePricesRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepo: ExperienceAvailabilityRepository,
		@Inject(ExperienceItineraryRepository)
		private readonly itineraryRepo: ExperienceItineraryRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepo: MediaItemRepository,
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
		private readonly configService: ConfigService,
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly ownerInfoResolver: OwnerInfoResolver,
		@Inject(GetFutureUnavailableDatesUseCase)
		private readonly getFutureUnavailableDatesUseCase: GetFutureUnavailableDatesUseCase,
	) {}

	async handle(id: string): Promise<ExperienceDetailResponse> {
		// -- Fetch experience principal
		const experience = await this.experienceRepo.getById(id);
		if (!experience) {
			throw new NotFoundException(`Experience with id ${id} not found`);
		}

		// -- Fetch sub-tablas y reviews en paralelo
		const [prices, , itineraries, reviews, moreExperiences] = await Promise.all(
			[
				this.pricesRepo.getById(experience.pricesId),
				this.availabilityRepo.getById(experience.availabilityId),
				this.itineraryRepo.getByIds(experience.itineraryIds),
				this.reviewRepository.getByProductIdAndType(id, ProductType.EXPERIENCE),
				this.experienceRepo.getAllWithFilters({
					page: 1,
					perPage: 4,
				}),
			],
		);

		// -- Batch-fetch de todos los media IDs únicos
		const mediaMap = await this.buildMediaMap(experience, itineraries);
		const mediaUrlById = await this.mediaUrlResolver.resolveUrls([
			...mediaMap.keys(),
		]);

		// -- Resolver owner, reviews en paralelo
		const [ownerInfo, reviewResponse] = await Promise.all([
			this.resolveOwner(
				experience.basicInfo.ownerId,
				experience.basicInfo.ownerType,
			),
			this.buildReviews(reviews),
		]);

		// -- Construir disponibilidad
		const availability = await this.buildAvailability(
			experience.availabilityId,
		);

		// -- Construir respuesta usando el mapper
		const price = ExperienceDetailMapper.resolvePrice(prices?.ageGroups);
		const ages = ExperienceDetailMapper.resolveAges(prices?.ageGroups);
		const agePricingInfo = ExperienceDetailMapper.resolveAgePricingInfo(
			prices ?? undefined,
		);
		const landscapeImgUrl =
			ExperienceDetailMapper.toMediaFullDetailFromMap(
				experience.mediaInfo.landscapeImg,
				mediaMap,
				mediaUrlById,
			)?.url || '';
		const photos = ExperienceDetailMapper.toMediaFullDetailList(
			experience.mediaInfo.photos ?? [],
			mediaMap,
			mediaUrlById,
		);

		return ExperienceDetailMapper.toDetailResponse({
			experience,
			price,
			ages,
			landscapeImgUrl,
			photos,
			ownerInfo,
			availability,
			agePricingInfo,
			itinerary: ExperienceDetailMapper.toItineraryResponse(
				itineraries,
				mediaMap,
				mediaUrlById,
			),
			moreExperiences: ExperienceDetailMapper.toMoreExperiencesResponse(
				moreExperiences.items,
				id,
				(key) => this.mediaUrlResolver.resolveKey(key),
			),
			review: reviewResponse,
		});
	}

	// ── Private helpers ──────────────────────────────────────────────────

	private async buildMediaMap(
		experience: {
			mediaInfo: {
				landscapeImg: string;
				thumbnailImg: string;
				photos?: string[];
				videos?: string[];
				ubicationImg?: string;
			};
		},
		itineraries: { photos: string[] }[],
	): Promise<Map<string, MediaItem>> {
		const mediaIds = new Set<string>();

		mediaIds.add(experience.mediaInfo.landscapeImg);
		mediaIds.add(experience.mediaInfo.thumbnailImg);
		experience.mediaInfo.photos?.forEach((mid) => mediaIds.add(mid));
		experience.mediaInfo.videos?.forEach((mid) => mediaIds.add(mid));
		if (experience.mediaInfo.ubicationImg) {
			mediaIds.add(experience.mediaInfo.ubicationImg);
		}
		itineraries.forEach((it) => it.photos.forEach((mid) => mediaIds.add(mid)));

		const mediaItems = await this.mediaItemRepo.getByIds([...mediaIds]);
		return new Map<string, MediaItem>(mediaItems.map((m) => [m.id, m]));
	}

	private async resolveOwner(
		ownerId: string,
		ownerType: OwnerType,
	): Promise<{ title: string; imgUrl: string }> {
		const resolved = await this.ownerInfoResolver.resolveDetailed(
			ownerType,
			ownerId,
		);
		if (!resolved) {
			return { title: '', imgUrl: '' };
		}

		if (resolved.ownerType === OwnerType.COMMUNITY) {
			return {
				title: resolved.community?.name || '',
				imgUrl: resolved.community?.bannerImageUrl || '',
			};
		}

		return {
			title: resolved.shop?.shopName || '',
			imgUrl: resolved.shop?.ownerImage || '',
		};
	}

	private async buildReviews(reviews: Review[]) {
		// Obtener accounts directamente usando accountId
		const accounts = await Promise.all(
			reviews.map((r) => this.accountRepository.getAccountById(r.accountId)),
		);

		const userNames = accounts.map((a) => ({
			name: a?.name || 'Usuario Anónimo',
		}));

		return ExperienceDetailMapper.toReviewsResponse(reviews, userNames);
	}

	private async buildAvailability(
		availabilityId: string,
	): Promise<ExperienceAvailabilityResponse> {
		const availability = await this.availabilityRepo.getById(availabilityId);
		const availableStartDates =
			await this.experienceRepo.getFutureAvailableDates(availabilityId);
		const weeklyStartDays =
			await this.experienceRepo.getWeeklyStartDays(availabilityId);
		const excludedDates =
			await this.getFutureUnavailableDatesUseCase.handle(availabilityId);

		return {
			weeklyStartDays,
			specificAvailableStartDates: availableStartDates,
			excludedDates,
		};
	}
}

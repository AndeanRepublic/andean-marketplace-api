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

import { MediaItem } from 'src/andean/domain/entities/MediaItem';
import { Review } from 'src/andean/domain/entities/Review';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';

import {
	ExperienceAvailabilityResponse,
	ExperienceDetailResponse,
} from '../../modules/experiences/ExperienceDetailResponse';
import { ExperienceDetailMapper } from 'src/andean/infra/services/experiences/ExperienceDetailMapper';
import { GetFutureUnavailableDatesUseCase } from './GetFutureUnavailableDatesUseCase';

@Injectable()
export class GetByIdExperienceUseCase {
	private readonly storageBaseUrl: string;

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
		@Inject(GetFutureUnavailableDatesUseCase)
		private readonly getFutureUnavailableDatesUseCase: GetFutureUnavailableDatesUseCase,
	) {
		this.storageBaseUrl = this.configService.get<string>(
			'STORAGE_BASE_URL',
			'',
		);
	}

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
				this.storageBaseUrl,
			)?.url || '';
		const photos = ExperienceDetailMapper.toMediaFullDetailList(
			experience.mediaInfo.photos ?? [],
			mediaMap,
			this.storageBaseUrl,
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
				this.storageBaseUrl,
			),
			moreExperiences: ExperienceDetailMapper.toMoreExperiencesResponse(
				moreExperiences.items,
				id,
				this.storageBaseUrl,
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
			};
		},
		itineraries: { photos: string[] }[],
	): Promise<Map<string, MediaItem>> {
		const mediaIds = new Set<string>();

		mediaIds.add(experience.mediaInfo.landscapeImg);
		mediaIds.add(experience.mediaInfo.thumbnailImg);
		experience.mediaInfo.photos?.forEach((mid) => mediaIds.add(mid));
		experience.mediaInfo.videos?.forEach((mid) => mediaIds.add(mid));
		itineraries.forEach((it) => it.photos.forEach((mid) => mediaIds.add(mid)));

		const mediaItems = await this.mediaItemRepo.getByIds([...mediaIds]);
		return new Map<string, MediaItem>(mediaItems.map((m) => [m.id, m]));
	}

	private async resolveOwner(
		ownerId: string,
		ownerType: OwnerType,
	): Promise<{ title: string; imgUrl: string }> {
		if (ownerType === OwnerType.COMMUNITY) {
			const community = await this.communityRepository.getById(ownerId);
			let imgUrl = '';
			if (community?.bannerImageId) {
				const bannerMedia = await this.mediaItemRepo.getById(
					community.bannerImageId,
				);
				imgUrl = bannerMedia ? `${this.storageBaseUrl}/${bannerMedia.key}` : '';
			}
			return { title: community?.name || '', imgUrl };
		}

		const shop = await this.shopRepository.getById(ownerId);
		return { title: shop?.name || '', imgUrl: '' };
	}

	private async buildReviews(reviews: Review[]) {
		const customers = await Promise.all(
			reviews.map((r) =>
				this.customerProfileRepository.getCustomerById(r.customerId),
			),
		);
		const accounts = await Promise.all(
			customers.map((c) =>
				c
					? this.accountRepository.getAccountByUserId(c.userId)
					: Promise.resolve(null),
			),
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

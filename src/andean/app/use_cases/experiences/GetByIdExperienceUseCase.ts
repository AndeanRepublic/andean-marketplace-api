import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceBasicInfoRepository } from '../../datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceMediaInfoRepository } from '../../datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceDetailInfoRepository } from '../../datastore/experiences/ExperienceDetailInfo.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';

import { MediaItem } from 'src/andean/domain/entities/MediaItem';
import {
	ExperienceDetailResponse,
	MediaItemDetail,
} from '../../models/experiences/ExperienceDetailResponse';

@Injectable()
export class GetByIdExperienceUseCase {
	private readonly storageBaseUrl: string;

	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepo: ExperienceRepository,
		@Inject(ExperienceBasicInfoRepository)
		private readonly basicInfoRepo: ExperienceBasicInfoRepository,
		@Inject(ExperienceMediaInfoRepository)
		private readonly mediaInfoRepo: ExperienceMediaInfoRepository,
		@Inject(ExperienceDetailInfoRepository)
		private readonly detailInfoRepo: ExperienceDetailInfoRepository,
		@Inject(ExperiencePricesRepository)
		private readonly pricesRepo: ExperiencePricesRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepo: ExperienceAvailabilityRepository,
		@Inject(ExperienceItineraryRepository)
		private readonly itineraryRepo: ExperienceItineraryRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepo: MediaItemRepository,
		private readonly configService: ConfigService,
	) {
		this.storageBaseUrl = this.configService.get<string>(
			'STORAGE_BASE_URL',
			'',
		);
	}

	async handle(id: string): Promise<ExperienceDetailResponse> {
		// 1. Fetch experience
		const experience = await this.experienceRepo.getById(id);
		if (!experience) {
			throw new NotFoundException(`Experience with id ${id} not found`);
		}

		// 2. Fetch all sub-tables in parallel (single round-trip)
		const [
			basicInfo,
			mediaInfo,
			detailInfo,
			prices,
			availability,
			itineraries,
		] = await Promise.all([
			this.basicInfoRepo.getById(experience.basicInfoId),
			this.mediaInfoRepo.getById(experience.mediaInfoId),
			this.detailInfoRepo.getById(experience.detailInfoId),
			this.pricesRepo.getById(experience.pricesId),
			this.availabilityRepo.getById(experience.availabilityId),
			this.itineraryRepo.getByIds(experience.itineraryIds),
		]);

		// 3. Collect all unique media IDs and batch-fetch
		const mediaIds = new Set<string>();

		if (mediaInfo) {
			mediaIds.add(mediaInfo.landscapeImg);
			mediaIds.add(mediaInfo.thumbnailImg);
			mediaInfo.photos?.forEach((mid) => mediaIds.add(mid));
			mediaInfo.videos?.forEach((mid) => mediaIds.add(mid));
		}

		itineraries.forEach((it) =>
			it.photos.forEach((mid) => mediaIds.add(mid)),
		);

		const mediaItems = await this.mediaItemRepo.getByIds([...mediaIds]);
		const mediaMap = new Map<string, MediaItem>(
			mediaItems.map((m) => [m.id, m]),
		);

		// 4. Build response
		const toMediaDetail = (mediaId: string): MediaItemDetail | null => {
			const item = mediaMap.get(mediaId);
			if (!item) return null;
			return {
				id: item.id,
				type: item.type,
				name: item.name,
				url: `${this.storageBaseUrl}/${item.key}`,
				role: item.role,
			};
		};

		const toMediaDetailList = (ids: string[]): MediaItemDetail[] =>
			ids
				.map((mid) => toMediaDetail(mid))
				.filter((m): m is MediaItemDetail => m !== null);

		// 5. Strip `id` from sub-table entities (response doesn't expose internal IDs)
		const { id: _bi, ...basicInfoData } = basicInfo ?? ({} as any);
		const { id: _di, ...detailInfoData } = detailInfo ?? ({} as any);
		const { id: _av, ...availabilityData } = availability ?? ({} as any);
		const { id: _pr, ageGroups, ...pricesRest } = prices ?? ({} as any);

		return {
			id: experience.id,
			status: experience.status,
			basicInfo: basicInfoData,
			mediaInfo: mediaInfo
				? {
					landscapeImg: toMediaDetail(mediaInfo.landscapeImg)!,
					thumbnailImg: toMediaDetail(mediaInfo.thumbnailImg)!,
					photos: toMediaDetailList(mediaInfo.photos ?? []),
					videos: toMediaDetailList(mediaInfo.videos ?? []),
				}
				: ({} as any),
			detailInfo: detailInfoData,
			prices: prices
				? {
					...pricesRest,
					ageGroups: ageGroups.map(({ ...ag }: any) => ag),
				}
				: ({} as any),
			availability: availabilityData,
			itineraries: itineraries.map((it) => ({
				numberDay: it.numberDay,
				nameDay: it.nameDay,
				descriptionDay: it.descriptionDay,
				photos: toMediaDetailList(it.photos),
				schedule: it.schedule.map((s) => ({
					time: s.time,
					activity: s.activity,
				})),
			})),
			createdAt: experience.createdAt,
			updatedAt: experience.updatedAt,
		};
	}
}

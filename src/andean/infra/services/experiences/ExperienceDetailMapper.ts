import { MediaItem } from 'src/andean/domain/entities/MediaItem';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { Review } from 'src/andean/domain/entities/Review';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceItinerary } from 'src/andean/domain/entities/experiences/ExperienceItinerary';
import { AgeGroup } from 'src/andean/domain/entities/experiences/AgeGroup';
import { ExperienceListRawItem } from 'src/andean/app/datastore/experiences/Experience.repo';

import {
	ExperienceDetailResponse,
	MediaItemFullDetail,
	MoreExperienceItemResponse,
	ReviewsResponse,
	ItineraryItemResponse,
	HeroDetailResponse,
	InformationResponse,
	QuestionSectionResponse,
	ExperienceAvailabilityResponse,
} from 'src/andean/app/models/experiences/ExperienceDetailResponse';

interface OwnerInfo {
	title: string;
	imgUrl: string;
}

interface ReviewUserInfo {
	name: string;
}

/**
 * Mapper estático para transformar datos de dominio al formato ExperienceDetailResponse.
 * Extrae la lógica de mapeo del use case para mantener SRP.
 */
export class ExperienceDetailMapper {
	// ── MediaItem mapping ─────────────────────────────────────────────

	static toMediaFullDetail(
		item: MediaItem,
		storageBaseUrl: string,
	): MediaItemFullDetail {
		return {
			id: item.id,
			type: item.type,
			name: item.name,
			url: `${storageBaseUrl}/${item.key}`,
			role: item.role,
			key: item.key,
			createdAt: item.createdAt,
		};
	}

	static toMediaFullDetailFromMap(
		mediaId: string,
		mediaMap: Map<string, MediaItem>,
		storageBaseUrl: string,
	): MediaItemFullDetail | null {
		const item = mediaMap.get(mediaId);
		if (!item) return null;
		return this.toMediaFullDetail(item, storageBaseUrl);
	}

	static toMediaFullDetailList(
		ids: string[],
		mediaMap: Map<string, MediaItem>,
		storageBaseUrl: string,
	): MediaItemFullDetail[] {
		return ids
			.map((mid) =>
				this.toMediaFullDetailFromMap(mid, mediaMap, storageBaseUrl),
			)
			.filter((m): m is MediaItemFullDetail => m !== null);
	}

	// ── Price resolution ──────────────────────────────────────────────

	static resolvePrice(ageGroups?: AgeGroup[]): number {
		if (!ageGroups || ageGroups.length === 0) return 0;

		const adults = ageGroups.find((ag) => ag.code === AgeGroupCode.ADULTS);
		if (adults) return adults.price;

		return ageGroups[0]?.price || 0;
	}

	// ── Age resolution ────────────────────────────────────────────────

	static resolveAges(ageGroups?: AgeGroup[]): { min: number; max: number } {
		if (!ageGroups || ageGroups.length === 0) {
			return { min: 0, max: 100 };
		}

		const minAges = ageGroups
			.filter((ag) => ag.minAge !== undefined)
			.map((ag) => ag.minAge!);
		const maxAges = ageGroups
			.filter((ag) => ag.maxAge !== undefined)
			.map((ag) => ag.maxAge!);

		return {
			min: minAges.length > 0 ? Math.min(...minAges) : 0,
			max: maxAges.length > 0 ? Math.max(...maxAges) : 100,
		};
	}

	// ── Reviews mapping ───────────────────────────────────────────────

	static calculateRatingStats(reviews: Review[]) {
		const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
		let totalStars = 0;

		reviews.forEach((r) => {
			const s = r.numberStarts;
			if (s >= 1 && s <= 5) {
				counts[s as keyof typeof counts]++;
				totalStars += s;
			}
		});

		const totalReviews = reviews.length;
		const avg = totalReviews > 0 ? totalStars / totalReviews : 0;

		return {
			count5stars: counts[5],
			count4stars: counts[4],
			count3stars: counts[3],
			count2stars: counts[2],
			count1star: counts[1],
			totalReviews,
			averagePunctuation: Math.round(avg * 10) / 10,
		};
	}

	static toReviewsResponse(
		reviews: Review[],
		userNames: ReviewUserInfo[],
	): ReviewsResponse {
		const rating = this.calculateRatingStats(reviews);
		const comments = reviews.map((review, i) => ({
			idReview: review.id,
			nameUser: userNames[i]?.name || 'Usuario Anónimo',
			content: review.content,
			numberStarts: review.numberStarts,
			date: review.createdAt,
			likes: review.numberLikes,
			dislikes: review.numberDislikes,
		}));

		return { rating, comments };
	}

	// ── Itinerary mapping ─────────────────────────────────────────────

	static toItineraryResponse(
		itineraries: ExperienceItinerary[],
		mediaMap: Map<string, MediaItem>,
		storageBaseUrl: string,
	): ItineraryItemResponse[] {
		return itineraries.map((it) => ({
			numberDay: it.numberDay,
			nameDay: it.nameDay,
			descriptionDay: it.descriptionDay,
			photos: this.toMediaFullDetailList(it.photos, mediaMap, storageBaseUrl),
			schedule: it.schedule.map((s) => ({
				time: s.time,
				activity: s.activity,
			})),
		}));
	}

	// ── MoreExperiences mapping ───────────────────────────────────────

	static toMoreExperiencesResponse(
		items: ExperienceListRawItem[],
		currentId: string,
		storageBaseUrl: string,
	): MoreExperienceItemResponse[] {
		return items
			.filter((exp) => exp.id !== currentId)
			.slice(0, 3)
			.map((exp) => ({
				id: exp.id,
				title: exp.title,
				ownerName: exp.ownerName,
				price: exp.adultsPrice,
				place: exp.ubication,
				days: exp.days,
				mainImage: {
					id: exp.mainImageName || '',
					type: MediaItemType.IMG,
					name: exp.mainImageName || '',
					url: exp.mainImageUrl ? `${storageBaseUrl}/${exp.mainImageUrl}` : '',
					role: MediaItemRole.PRINCIPAL,
					key: exp.mainImageUrl || '',
				},
			}));
	}

	// ── Section builders ──────────────────────────────────────────────

	static toHeroDetail(
		experience: Experience,
		price: number,
		landscapeImgUrl: string,
		photos: MediaItemFullDetail[],
		ownerInfo: OwnerInfo,
	): HeroDetailResponse {
		return {
			title: experience.basicInfo.title,
			shortDescription: experience.detailInfo.shortDescription,
			largeDescription: experience.detailInfo.largeDescription,
			days: experience.basicInfo.days,
			nights: experience.basicInfo.nights,
			price,
			landscapeImgUrl,
			photos,
			ownerId: experience.basicInfo.ownerId,
			ownerType: experience.basicInfo.ownerType,
			ownerTitle: ownerInfo.title,
			ownerImgUrl: ownerInfo.imgUrl,
		};
	}

	static toInformation(
		experience: Experience,
		ages: { min: number; max: number },
	): InformationResponse {
		return {
			minAge: ages.min,
			maxAge: ages.max,
			duration: experience.basicInfo.days,
			languages: experience.basicInfo.languages,
		};
	}

	static toQuestionSection(experience: Experience): QuestionSectionResponse {
		return {
			includes: experience.detailInfo.includes.join(', '),
			shouldCarry: experience.detailInfo.shouldCarry,
			pickupDetail: experience.detailInfo.pickupDetail,
			returnDetail: experience.detailInfo.returnDetail,
			accommodationDetail: experience.detailInfo.accommodationDetail,
			accessibilityDetail: experience.detailInfo.accessibilityDetail,
			aditionalInformation: experience.detailInfo.aditionalInformation,
			cancellationPolicy: experience.detailInfo.cancellationPolicy,
			contactNumber: experience.detailInfo.contactNumber,
		};
	}

	// ── Main response builder ─────────────────────────────────────────

	static toDetailResponse(params: {
		experience: Experience;
		price: number;
		ages: { min: number; max: number };
		landscapeImgUrl: string;
		photos: MediaItemFullDetail[];
		ownerInfo: OwnerInfo;
		availability: ExperienceAvailabilityResponse;
		itinerary: ItineraryItemResponse[];
		moreExperiences: MoreExperienceItemResponse[];
		review: ReviewsResponse;
	}): ExperienceDetailResponse {
		return {
			heroDetail: this.toHeroDetail(
				params.experience,
				params.price,
				params.landscapeImgUrl,
				params.photos,
				params.ownerInfo,
			),
			information: this.toInformation(params.experience, params.ages),
			availability: params.availability,
			questionSection: this.toQuestionSection(params.experience),
			itinerary: params.itinerary,
			moreExperiences: params.moreExperiences,
			review: params.review,
		};
	}
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceStatus } from 'src/andean/domain/enums/ExperienceStatus';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

// ─── MediaItem resolved ────────────────────────────────────────

export class MediaItemDetail {
	@ApiProperty() id!: string;
	@ApiProperty({ enum: MediaItemType }) type!: MediaItemType;
	@ApiProperty() name!: string;
	@ApiProperty({ description: 'URL completa construida con STORAGE_BASE_URL + key' }) url!: string;
	@ApiProperty({ enum: MediaItemRole }) role!: MediaItemRole;
}

// ─── BasicInfo ─────────────────────────────────────────────────

export class ExperienceBasicInfoDetail {
	@ApiProperty() title!: string;
	@ApiProperty() ubication!: string;
	@ApiProperty() days!: number;
	@ApiProperty() nights!: number;
	@ApiProperty() minNumberGroup!: number;
	@ApiProperty() maxNumberGroup!: number;
	@ApiProperty({ enum: ExperienceLanguage, isArray: true }) languages!: ExperienceLanguage[];
	@ApiProperty({ enum: OwnerType }) ownerType!: OwnerType;
	@ApiProperty() ownerId!: string;
	@ApiPropertyOptional() category?: string;
}

// ─── MediaInfo (resolved) ──────────────────────────────────────

export class ExperienceMediaInfoDetail {
	@ApiProperty({ type: MediaItemDetail }) landscapeImg!: MediaItemDetail;
	@ApiProperty({ type: MediaItemDetail }) thumbnailImg!: MediaItemDetail;
	@ApiProperty({ type: [MediaItemDetail] }) photos!: MediaItemDetail[];
	@ApiProperty({ type: [MediaItemDetail] }) videos!: MediaItemDetail[];
}

// ─── DetailInfo ────────────────────────────────────────────────

export class ExperienceDetailInfoDetail {
	@ApiProperty() shortDescription!: string;
	@ApiProperty() largeDescription!: string;
	@ApiProperty({ type: [String] }) includes!: string[];
	@ApiProperty({ type: [String] }) notIncludes!: string[];
	@ApiProperty() pickupDetail!: string;
	@ApiProperty() returnDetail!: string;
	@ApiProperty() accommodationDetail!: string;
	@ApiProperty() accessibilityDetail!: string;
	@ApiProperty() cancellationPolicy!: string;
	@ApiPropertyOptional({ type: [String] }) shouldCarry?: string[];
	@ApiPropertyOptional({ type: [String] }) aditionalInformation?: string[];
	@ApiPropertyOptional() contactNumber?: string;
}

// ─── Prices ────────────────────────────────────────────────────

export class AgeGroupDetail {
	@ApiProperty({ enum: AgeGroupCode }) code!: AgeGroupCode;
	@ApiProperty() label!: string;
	@ApiProperty() price!: number;
	@ApiPropertyOptional() minAge?: number;
	@ApiPropertyOptional() maxAge?: number;
}

export class ExperiencePricesDetail {
	@ApiProperty() useAgeBasedPricing!: boolean;
	@ApiProperty() currency!: string;
	@ApiProperty({ type: [AgeGroupDetail] }) ageGroups!: AgeGroupDetail[];
}

// ─── Availability ──────────────────────────────────────────────

export class ExperienceAvailabilityDetail {
	@ApiProperty({ enum: WeekDay, isArray: true }) weeklyStartDays!: WeekDay[];
	@ApiProperty({ type: [Date] }) specificAvailableDates!: Date[];
	@ApiProperty({ type: [Date] }) excludedDates!: Date[];
}

// ─── Itinerary (photos resolved) ───────────────────────────────

export class ItineraryScheduleDetail {
	@ApiProperty() time!: string;
	@ApiProperty() activity!: string;
}

export class ExperienceItineraryDetail {
	@ApiProperty() numberDay!: number;
	@ApiProperty() nameDay!: string;
	@ApiProperty() descriptionDay!: string;
	@ApiProperty({ type: [MediaItemDetail] }) photos!: MediaItemDetail[];
	@ApiProperty({ type: [ItineraryScheduleDetail] }) schedule!: ItineraryScheduleDetail[];
}

// ─── Main Response ─────────────────────────────────────────────

export class ExperienceDetailResponse {
	@ApiProperty() id!: string;
	@ApiProperty({ enum: ExperienceStatus }) status!: ExperienceStatus;
	@ApiProperty({ type: ExperienceBasicInfoDetail }) basicInfo!: ExperienceBasicInfoDetail;
	@ApiProperty({ type: ExperienceMediaInfoDetail }) mediaInfo!: ExperienceMediaInfoDetail;
	@ApiProperty({ type: ExperienceDetailInfoDetail }) detailInfo!: ExperienceDetailInfoDetail;
	@ApiProperty({ type: ExperiencePricesDetail }) prices!: ExperiencePricesDetail;
	@ApiProperty({ type: ExperienceAvailabilityDetail }) availability!: ExperienceAvailabilityDetail;
	@ApiProperty({ type: [ExperienceItineraryDetail] }) itineraries!: ExperienceItineraryDetail[];
	@ApiProperty() createdAt!: Date;
	@ApiProperty() updatedAt!: Date;
}

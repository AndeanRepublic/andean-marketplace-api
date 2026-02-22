import { Document, Schema } from 'mongoose';
import { ExperienceStatus } from 'src/andean/domain/enums/ExperienceStatus';
import { ExperienceBasicInfoSchema } from './experienceBasicInfo.schema';
import { ExperienceMediaInfoSchema } from './experienceMediaInfo.schema';
import { ExperienceDetailInfoSchema } from './experienceDetailInfo.schema';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';

export const ExperienceSchema = new Schema({
	status: {
		type: String,
		enum: Object.values(ExperienceStatus),
		required: true,
	},
	basicInfo: { type: ExperienceBasicInfoSchema, required: true },
	mediaInfo: { type: ExperienceMediaInfoSchema, required: true },
	detailInfo: { type: ExperienceDetailInfoSchema, required: true },
	pricesId: { type: String, required: true },
	availabilityId: { type: String, required: true },
	itineraryIds: { type: [String], required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface ExperienceDocument extends Document {
	status: ExperienceStatus;
	basicInfo: {
		title: string;
		ubication: string;
		days: number;
		nights: number;
		minNumberGroup: number;
		maxNumberGroup: number;
		languages: ExperienceLanguage[];
		ownerType: OwnerType;
		ownerId: string;
		category?: string;
	};
	mediaInfo: {
		landscapeImg: string;
		thumbnailImg: string;
		photos?: string[];
		videos?: string[];
	};
	detailInfo: {
		shortDescription: string;
		largeDescription: string;
		includes: string[];
		notIncludes: string[];
		pickupDetail: string;
		returnDetail: string;
		accommodationDetail: string;
		accessibilityDetail: string;
		cancellationPolicy: string;
		shouldCarry?: string[];
		aditionalInformation?: string[];
		contactNumber?: string;
	};
	pricesId: string;
	availabilityId: string;
	itineraryIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

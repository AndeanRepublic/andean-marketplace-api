import { Schema } from 'mongoose';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { ExperienceDurationUnit } from 'src/andean/domain/enums/ExperienceDurationUnit';

// Sub-schema embebido — { _id: false } porque no es una colección propia
export const ExperienceBasicInfoSchema = new Schema(
	{
		title: { type: String, required: true },
		ubication: { type: String, required: true },
		days: { type: Number, required: true },
		nights: { type: Number, required: true },
	durationUnit: {
		type: String,
		enum: Object.values(ExperienceDurationUnit),
		required: true,
		default: ExperienceDurationUnit.DAYS,
	},
	hours: { type: Number, required: false },
		minNumberGroup: { type: Number, required: true },
		maxNumberGroup: { type: Number, required: true },
		languages: {
			type: [String],
			enum: Object.values(ExperienceLanguage),
			required: true,
		},
		ownerType: {
			type: String,
			enum: Object.values(OwnerType),
			required: true,
		},
		ownerId: { type: String, required: true },
		includesPickup: { type: Boolean, required: true, default: false },
		includesAccommodation: { type: Boolean, required: true, default: false },
		includesReturn: { type: Boolean, required: true, default: false },
		category: { type: String, required: false },
	},
	{ _id: false },
);

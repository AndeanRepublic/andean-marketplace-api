import { Schema } from 'mongoose';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';

// Sub-schema embebido — { _id: false } porque no es una colección propia
export const ExperienceBasicInfoSchema = new Schema(
	{
		title: { type: String, required: true },
		ubication: { type: String, required: true },
		days: { type: Number, required: true },
		nights: { type: Number, required: true },
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
		category: { type: String, required: false },
	},
	{ _id: false },
);

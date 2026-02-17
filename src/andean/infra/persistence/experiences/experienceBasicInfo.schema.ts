import { Document, Schema } from 'mongoose';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';

export const ExperienceBasicInfoSchema = new Schema({
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
});

export interface ExperienceBasicInfoDocument extends Document {
	title: string;
	ubication: string;
	days: number;
	nights: number;
	minNumberGroup: number;
	maxNumberGroup: number;
	languages: ExperienceLanguage[];
	ownerType: OwnerType;
	ownerId: string;
}

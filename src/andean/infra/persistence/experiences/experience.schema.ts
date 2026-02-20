import { Document, Schema } from 'mongoose';
import { ExperienceStatus } from 'src/andean/domain/enums/ExperienceStatus';

export const ExperienceSchema = new Schema({
	status: {
		type: String,
		enum: Object.values(ExperienceStatus),
		required: true,
	},
	basicInfoId: { type: String, required: true },
	mediaInfoId: { type: String, required: true },
	detailInfoId: { type: String, required: true },
	pricesId: { type: String, required: true },
	availabilityId: { type: String, required: true },
	itineraryIds: { type: [String], required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface ExperienceDocument extends Document {
	status: ExperienceStatus;
	basicInfoId: string;
	mediaInfoId: string;
	detailInfoId: string;
	pricesId: string;
	availabilityId: string;
	itineraryIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

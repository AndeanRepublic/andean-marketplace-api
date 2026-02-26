import { Document, Schema } from 'mongoose';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';

export const ExperienceAvailabilitySchema = new Schema({
	mode: {
		type: String,
		enum: Object.values(ExperienceAvailabilityMode),
		required: true,
		default: ExperienceAvailabilityMode.EXCLUSIVE_GROUP,
	},
	weeklyStartDays: {
		type: [Number],
		enum: Object.values(WeekDay).filter((v) => typeof v === 'number'),
		required: true,
	},
	specificAvailableStartDates: { type: [Date], default: [] },
	excludedDates: { type: [Date], default: [] },
});

export interface ExperienceAvailabilityDocument extends Document {
	mode: ExperienceAvailabilityMode;
	weeklyStartDays: WeekDay[];
	specificAvailableStartDates: Date[];
	excludedDates: Date[];
}

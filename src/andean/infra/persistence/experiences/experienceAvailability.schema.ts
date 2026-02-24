import { Document, Schema } from 'mongoose';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';

export const ExperienceAvailabilitySchema = new Schema({
	weeklyStartDays: {
		type: [Number],
		enum: Object.values(WeekDay).filter((v) => typeof v === 'number'),
		required: true,
	},
	specificAvailableStartDates: { type: [Date], default: [] },
	excludedDates: { type: [Date], default: [] },
});

export interface ExperienceAvailabilityDocument extends Document {
	weeklyStartDays: WeekDay[];
	specificAvailableStartDates: Date[];
	excludedDates: Date[];
}

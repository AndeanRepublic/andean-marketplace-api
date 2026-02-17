import { Document, Schema } from 'mongoose';

const ItineraryScheduleSchema = new Schema(
	{
		time: { type: String, required: true },
		activity: { type: String, required: true },
	},
	{ _id: false },
);

export const ExperienceItinerarySchema = new Schema({
	numberDay: { type: Number, required: true },
	nameDay: { type: String, required: true },
	descriptionDay: { type: String, required: true },
	photos: { type: [String], default: [] },
	schedule: { type: [ItineraryScheduleSchema], required: true },
});

export interface ExperienceItineraryDocument extends Document {
	numberDay: number;
	nameDay: string;
	descriptionDay: string;
	photos: string[];
	schedule: {
		time: string;
		activity: string;
	}[];
}

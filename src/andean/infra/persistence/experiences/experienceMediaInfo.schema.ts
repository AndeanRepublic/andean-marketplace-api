import { Document, Schema } from 'mongoose';

export const ExperienceMediaInfoSchema = new Schema({
	landscapeImg: { type: String, required: true },
	thumbnailImg: { type: String, required: true },
	photos: { type: [String], default: [] },
	videos: { type: [String], default: [] },
});

export interface ExperienceMediaInfoDocument extends Document {
	landscapeImg: string;
	thumbnailImg: string;
	photos?: string[];
	videos?: string[];
}

import { Schema } from 'mongoose';

// Sub-schema embebido — { _id: false } porque no es una colección propia
export const ExperienceMediaInfoSchema = new Schema({
	landscapeImg: { type: String, required: true },
	thumbnailImg: { type: String, required: true },
	photos: { type: [String], default: [] },
	videos: { type: [String], default: [] },
	ubicationImg: { type: String, required: false },
}, { _id: false });

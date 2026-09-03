import { Document, Schema } from 'mongoose';

export const ShopPageInfoSchema = new Schema({
	tagline: { type: String, required: true },
	shortBio: { type: String, required: true },
	historyImageMediaIds: { type: [String], default: [] },
	whatWeDoDescription: { type: String, required: true },
	whatWeDoImageMediaIds: { type: [String], default: [] },
});

export interface ShopPageInfoDocument extends Document {
	tagline: string;
	shortBio: string;
	historyImageMediaIds: string[];
	whatWeDoDescription: string;
	whatWeDoImageMediaIds: string[];
}

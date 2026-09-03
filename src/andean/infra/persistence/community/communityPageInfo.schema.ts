import { Document, Schema } from 'mongoose';

export const CommunityPageInfoSchema = new Schema({
	tagline: { type: String, required: true },
	shortBio: { type: String, required: true },
	familyCount: { type: Number, required: true },
	weaverCount: { type: Number, required: true },
	activityYears: { type: Number, required: true },
	infoImageMediaIds: { type: [String], default: [] },
	whatWeDoDescription: { type: String, required: true },
	whatWeDoImageMediaIds: { type: [String], default: [] },
	galleryPhotoMediaIds: { type: [String], default: [] },
	galleryVideoMediaId: { type: String, required: false },
	galleryVideoPosterMediaId: { type: String, required: false },
});

export interface CommunityPageInfoDocument extends Document {
	tagline: string;
	shortBio: string;
	familyCount: number;
	weaverCount: number;
	activityYears: number;
	infoImageMediaIds: string[];
	whatWeDoDescription: string;
	whatWeDoImageMediaIds: string[];
	galleryPhotoMediaIds: string[];
	galleryVideoMediaId?: string;
	galleryVideoPosterMediaId?: string;
}

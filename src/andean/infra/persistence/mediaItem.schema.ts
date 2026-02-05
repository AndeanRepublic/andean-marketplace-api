import { Document, Schema } from 'mongoose';
import { MediaItemType } from '../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../domain/enums/MediaItemRole';

export const MediaItemSchema = new Schema({
	type: { type: String, enum: Object.values(MediaItemType), required: true },
	name: { type: String, required: true },
	key: { type: String, required: true }, // Path dentro del bucket
	role: { type: String, enum: Object.values(MediaItemRole), default: MediaItemRole.NONE },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface MediaItemDocument extends Document {
	type: MediaItemType;
	name: string;
	key: string;
	role: MediaItemRole;
	createdAt: Date;
	updatedAt: Date;
}

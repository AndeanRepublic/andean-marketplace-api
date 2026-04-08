import { Document, Schema } from 'mongoose';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export const CommunitySchema = new Schema({
	name: { type: String, required: true },
	bannerImageId: { type: String, required: true },
	status: {
		type: String,
		enum: Object.values(AdminEntityStatus),
		default: AdminEntityStatus.HIDDEN,
	},
	seals: { type: [String], default: [] },
	providerInfoId: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CommunityDocument extends Document {
	name: string;
	bannerImageId: string;
	status: AdminEntityStatus;
	seals?: string[];
	providerInfoId?: string;
	createdAt: Date;
	updatedAt: Date;
}

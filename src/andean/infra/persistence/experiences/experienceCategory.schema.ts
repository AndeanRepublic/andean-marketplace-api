import { Document, Schema } from 'mongoose';
import { ExperienceCategoryStatus } from 'src/andean/domain/enums/ExperienceCategoryStatus';

export const ExperienceCategorySchema = new Schema({
	name: { type: String, required: true },
	status: {
		type: String,
		enum: Object.values(ExperienceCategoryStatus),
		required: true,
		default: ExperienceCategoryStatus.ENABLED,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface ExperienceCategoryDocument extends Document {
	name: string;
	status: ExperienceCategoryStatus;
	createdAt: Date;
	updatedAt: Date;
}

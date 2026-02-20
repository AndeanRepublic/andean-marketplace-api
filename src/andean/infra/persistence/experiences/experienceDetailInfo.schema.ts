import { Document, Schema } from 'mongoose';

export const ExperienceDetailInfoSchema = new Schema({
	shortDescription: { type: String, required: true },
	largeDescription: { type: String, required: true },
	includes: { type: [String], required: true },
	notIncludes: { type: [String], required: true },
	pickupDetail: { type: String, required: true },
	returnDetail: { type: String, required: true },
	accommodationDetail: { type: String, required: true },
	accessibilityDetail: { type: String, required: true },
	cancellationPolicy: { type: String, required: true },
	shouldCarry: { type: [String], default: [] },
	aditionalInformation: { type: [String], default: [] },
	contactNumber: { type: String, required: false },
});

export interface ExperienceDetailInfoDocument extends Document {
	shortDescription: string;
	largeDescription: string;
	includes: string[];
	notIncludes: string[];
	pickupDetail: string;
	returnDetail: string;
	accommodationDetail: string;
	accessibilityDetail: string;
	cancellationPolicy: string;
	shouldCarry?: string[];
	aditionalInformation?: string[];
	contactNumber?: string;
}

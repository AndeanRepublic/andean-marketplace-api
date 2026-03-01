import { Document, Schema } from 'mongoose';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';

const AgeGroupSchema = new Schema(
	{
		code: {
			type: String,
			enum: Object.values(AgeGroupCode),
			required: true,
		},
		label: { type: String, required: true },
		price: { type: Number, required: true },
		minAge: { type: Number, required: false },
		maxAge: { type: Number, required: false },
	},
	{ _id: false },
);

export const ExperiencePricesSchema = new Schema({
	useAgeBasedPricing: { type: Boolean, required: true },
	currency: { type: String, required: true, default: 'USD' },
	ageGroups: { type: [AgeGroupSchema], required: true },
});

export interface ExperiencePricesDocument extends Document {
	useAgeBasedPricing: boolean;
	currency: string;
	ageGroups: {
		code: AgeGroupCode;
		label: string;
		price: number;
		minAge?: number;
		maxAge?: number;
	}[];
}

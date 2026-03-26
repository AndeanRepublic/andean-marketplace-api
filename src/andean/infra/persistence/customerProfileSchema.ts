import { Document, Schema } from 'mongoose';
import { CoinType } from '../../domain/enums/CoinType';

// Don't define _id - let MongoDB generate it automatically as ObjectId
export const CustomerProfileSchema = new Schema({
	userId: { type: String, required: true, unique: true },
	country: { type: String, required: false },
	phoneNumber: { type: String, required: false },
	language: { type: String, required: false },
	coin: {
		type: String,
		enum: Object.values(CoinType),
		required: false,
	},
	birthDate: { type: Date, required: false },
	profilePictureMediaId: { type: String, required: false },
});

export interface CustomerProfileDocument extends Document {
	userId: string;
	country?: string;
	phoneNumber?: string;
	language?: string;
	coin?: CoinType;
	birthDate?: Date;
	profilePictureMediaId?: string;
}

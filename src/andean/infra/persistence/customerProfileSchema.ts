import { Document, Schema, Types } from 'mongoose';
import { CoinType } from '../../domain/enums/CoinType';

export const CustomerProfileSchema = new Schema({
	_id: String,
	id: String,
	userId: String,
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

export interface CustomerProfileDocument extends Document<string> {
	_id: string;
	id: string;
	userId: string;
	country?: string;
	phoneNumber?: string;
	language?: string;
	coin?: CoinType;
	birthDate?: Date;
	profilePictureMediaId?: string;
}

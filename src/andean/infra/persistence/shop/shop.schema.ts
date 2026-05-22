import { Document, Schema } from 'mongoose';
import { ShopCategory } from '../../../domain/enums/ShopCategory';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

export const ShopSchema = new Schema({
	sellerId: String,
	name: String,
	status: {
		type: String,
		enum: Object.values(ShopStatus),
		default: ShopStatus.PENDING,
	},
	categories: [
		{
			type: String,
			enum: Object.values(ShopCategory),
		},
	],
	providerInfoId: { type: String, required: false },
	artisanPhotoMediaId: { type: String, required: false },
	seals: { type: [String], default: [] },
});

export interface ShopDocument extends Document<string> {
	sellerId?: string;
	name: string;
	status: ShopStatus;
	categories: ShopCategory[];
	providerInfoId?: string;
	artisanPhotoMediaId?: string;
	seals?: string[];
}

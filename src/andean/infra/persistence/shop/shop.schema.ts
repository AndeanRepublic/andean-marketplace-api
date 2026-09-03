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
	imageOrIconMediaId: { type: String, required: true },
	providerInfoId: { type: String, required: false },
	seals: { type: [String], default: [] },
	activePage: { type: Boolean, default: false },
	pageInfoId: { type: String, required: false },
	founderInfoId: { type: String, required: false },
});

export interface ShopDocument extends Document<string> {
	sellerId?: string;
	name: string;
	status: ShopStatus;
	categories: ShopCategory[];
	imageOrIconMediaId: string;
	providerInfoId?: string;
	seals?: string[];
	activePage: boolean;
	pageInfoId?: string;
	founderInfoId?: string;
}

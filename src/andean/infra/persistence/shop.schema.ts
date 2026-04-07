import { Document, Schema } from 'mongoose';
import { ShopCategory } from '../../domain/enums/ShopCategory';
import { AdminEntityStatus } from '../../domain/enums/AdminEntityStatus';

export const ShopSchema = new Schema({
	sellerId: String,
	name: String,
	status: {
		type: String,
		enum: Object.values(AdminEntityStatus),
		default: AdminEntityStatus.HIDDEN,
	},
	categories: [
		{
			type: String,
			enum: Object.values(ShopCategory),
		},
	],
	providerInfoId: { type: String, required: false },
	artisanPhotoMediaId: { type: String, required: false },
});

export interface ShopDocument extends Document<string> {
	sellerId?: string;
	name: string;
	status: AdminEntityStatus;
	categories: ShopCategory[];
	providerInfoId?: string;
	artisanPhotoMediaId?: string;
}

import { Document, Schema } from 'mongoose';
import { ShopCategory } from '../../domain/enums/ShopCategory';

export const ShopSchema = new Schema({
	sellerId: String,
	name: String,
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
	categories: ShopCategory[];
	providerInfoId?: string;
	artisanPhotoMediaId?: string;
}

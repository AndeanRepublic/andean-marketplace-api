import { Document, Schema } from 'mongoose';
import { ShopCategory } from '../../domain/enums/ShopCategory';

export const ShopSchema = new Schema({
	_id: String,
	id: String,
	sellerId: String,
	name: String,
	description: String,
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
	_id: string;
	id: string;
	sellerId?: string;
	name: string;
	description: string;
	categories: ShopCategory[];
	providerInfoId?: string;
	artisanPhotoMediaId?: string;
}

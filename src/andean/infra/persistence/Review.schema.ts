import { Document, Schema } from 'mongoose';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export const ReviewSchema = new Schema({
	content: String,
	numberStarts: Number,
	imgUrl: { type: String, required: false },
	customerId: String,
	productId: String,
	productType: {
		type: String,
		enum: Object.values(ProductType),
		required: true,
	},
	numberLikes: Number,
	numberDislikes: Number,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface ReviewDocument extends Document {
	content: string;
	numberStarts: number;
	imgUrl?: string;
	customerId: string;
	productId: string;
	productType: ProductType;
	numberLikes: number;
	numberDislikes: number;
	createdAt: Date;
	updatedAt: Date;
}

import { Document, Schema } from 'mongoose';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export const ReviewSchema = new Schema({
	content: String,
	numberStars: Number,
	mediaId: { type: String, required: false },
	accountId: String,
	productId: String,
	productType: {
		type: String,
		enum: Object.values(ProductType),
		required: true,
	},
	numberLikes: Number,
	numberDislikes: Number,
	likedBy: { type: [String], default: [] },
	dislikedBy: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface ReviewDocument extends Document {
	content: string;
	numberStars: number;
	mediaId?: string;
	accountId: string;
	productId: string;
	productType: ProductType;
	numberLikes: number;
	numberDislikes: number;
	likedBy: string[];
	dislikedBy: string[];
	createdAt: Date;
	updatedAt: Date;
}

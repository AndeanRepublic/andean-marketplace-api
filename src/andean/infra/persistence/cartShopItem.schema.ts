import { Document, Schema } from 'mongoose';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export const CartItemSchema = new Schema({
	cartShopId: { type: String, required: true },
	productType: {
		type: String,
		enum: Object.values(ProductType),
		required: true,
	},
	productId: { type: String, required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
	discount: { type: Number, required: true },
	variantProductId: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface CartShopItemDocument extends Document {
	cartShopId: string;
	productType: ProductType;
	productId: string;
	quantity: number;
	unitPrice: number;
	discount: number;
	variantProductId?: string;
	createdAt: Date;
	updatedAt: Date;
}

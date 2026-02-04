import { Document, Schema } from 'mongoose';

// Schema para AdministrativeArea embebido
const AdministrativeAreaSchema = new Schema(
	{
		level1: { type: String, required: false },
		level2: { type: String, required: false },
		level3: { type: String, required: false },
	},
	{ _id: false },
);

export const ShippingAddressSchema = new Schema({
	customerId: { type: String, required: true, index: true },
	recipientName: { type: String, required: true },
	phone: { type: String, required: true },
	countryCode: { type: String, required: true },
	country: { type: String, required: true },
	city: { type: String, required: true },
	administrativeArea: { type: AdministrativeAreaSchema, required: true },
	addressLine1: { type: String, required: true },
	addressLine2: { type: String, required: false },
	postalCode: { type: String, required: false },
	isDefault: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Index para búsquedas por customerId
ShippingAddressSchema.index({ customerId: 1 });

export interface ShippingAddressDocument extends Document {
	customerId: string;
	recipientName: string;
	phone: string;
	countryCode: string;
	country: string;
	city: string;
	administrativeArea: {
		level1?: string;
		level2?: string;
		level3?: string;
	};
	addressLine1: string;
	addressLine2?: string;
	postalCode?: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}

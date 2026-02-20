import { Document, Schema } from 'mongoose';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { AgeGroupCode } from '../../../domain/enums/AgeGroupCode';
import { ExperienceLanguage } from '../../../domain/enums/ExperienceLanguage';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';
import { PaymentProvider } from '../../../domain/enums/PaymentProvider';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';

const CustomerInfoSchema = new Schema(
	{
		customerId: { type: String, required: false },
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phoneNumber: { type: String, required: true },
	},
	{ _id: false },
);

const AgeGroupPricingSchema = new Schema(
	{
		code: {
			type: String,
			enum: Object.values(AgeGroupCode),
			required: true,
		},
		label: { type: String, required: true },
		minAge: { type: Number, required: false },
		maxAge: { type: Number, required: false },
		price: { type: Number, required: true },
	},
	{ _id: false },
);

const ExperienceSnapshotSchema = new Schema(
	{
		name: { type: String, required: true },
		days: { type: Number, required: true },
		nights: { type: Number, required: true },
		ageGroupPricing: {
			type: [AgeGroupPricingSchema],
			required: true,
		},
	},
	{ _id: false },
);

const ExperienceInfoSchema = new Schema(
	{
		experienceId: { type: String, required: true },
		experienceSnapshot: {
			type: ExperienceSnapshotSchema,
			required: true,
		},
	},
	{ _id: false },
);

const BookingPricingSchema = new Schema(
	{
		subtotal: { type: Number, required: true },
		total: { type: Number, required: true },
		discountAmount: { type: Number, required: false },
		taxAmount: { type: Number, required: false },
		feeAmount: { type: Number, required: false },
		currency: { type: String, required: true },
	},
	{ _id: false },
);

const AgeGroupInfoSchema = new Schema(
	{
		code: {
			type: String,
			enum: Object.values(AgeGroupCode),
			required: true,
		},
		quantity: { type: Number, required: true },
	},
	{ _id: false },
);

const TravelerInfoSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		country: { type: String, required: true },
		birthDate: { type: Date, required: true },
	},
	{ _id: false },
);

const GuestsInfoSchema = new Schema(
	{
		ageGroups: { type: [AgeGroupInfoSchema], required: true },
		totalGuests: { type: Number, required: true },
		travelersInfo: { type: [TravelerInfoSchema], required: true },
		arrivalPlace: { type: String, required: false },
		language: {
			type: String,
			enum: Object.values(ExperienceLanguage),
			required: true,
		},
	},
	{ _id: false },
);

const BookingPaymentInfoSchema = new Schema(
	{
		method: {
			type: String,
			enum: Object.values(PaymentMethod),
			required: true,
		},
		amountAuthorized: { type: Number, required: false },
		amountCaptured: { type: Number, required: false },
		amountRefunded: { type: Number, required: false },
		provider: {
			type: String,
			enum: Object.values(PaymentProvider),
			required: false,
		},
		status: {
			type: String,
			enum: Object.values(PaymentStatus),
			required: true,
		},
		providerTransactionId: { type: String, required: false },
		paidAt: { type: Date, required: false },
	},
	{ _id: false },
);

export const BookingSchema = new Schema({
	customerInfo: { type: CustomerInfoSchema, required: true },
	status: {
		type: String,
		enum: Object.values(BookingStatus),
		required: true,
	},
	experienceDate: { type: Date, required: true },
	experience: { type: ExperienceInfoSchema, required: true },
	pricing: { type: BookingPricingSchema, required: true },
	guestsInfo: { type: GuestsInfoSchema, required: true },
	payment: { type: BookingPaymentInfoSchema, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface BookingDocument extends Document {
	customerInfo: {
		customerId?: string;
		email: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	status: BookingStatus;
	experienceDate: Date;
	experience: {
		experienceId: string;
		experienceSnapshot: {
			name: string;
			days: number;
			nights: number;
			ageGroupPricing: {
				code: AgeGroupCode;
				label: string;
				minAge?: number;
				maxAge?: number;
				price: number;
			}[];
		};
	};
	pricing: {
		subtotal: number;
		total: number;
		discountAmount?: number;
		taxAmount?: number;
		feeAmount?: number;
		currency: string;
	};
	guestsInfo: {
		ageGroups: {
			code: AgeGroupCode;
			quantity: number;
		}[];
		totalGuests: number;
		travelersInfo: {
			firstName: string;
			lastName: string;
			country: string;
			birthDate: Date;
		}[];
		arrivalPlace?: string;
		language: ExperienceLanguage;
	};
	payment: {
		method: PaymentMethod;
		amountAuthorized?: number;
		amountCaptured?: number;
		amountRefunded?: number;
		provider?: PaymentProvider;
		status: PaymentStatus;
		providerTransactionId?: string;
		paidAt?: Date;
	};
	createdAt: Date;
	updatedAt: Date;
}

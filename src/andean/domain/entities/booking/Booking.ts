import { BookingStatus } from '../../enums/BookingStatus';
import { AgeGroupCode } from '../../enums/AgeGroupCode';
import { ExperienceLanguage } from '../../enums/ExperienceLanguage';
import { PaymentMethod } from '../../enums/PaymentMethod';
import { PaymentProvider } from '../../enums/PaymentProvider';
import { PaymentStatus } from '../../enums/PaymentStatus';

export interface CustomerInfo {
	customerId?: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
}

export interface AgeGroupPricing {
	code: AgeGroupCode;
	label: string;
	minAge?: number;
	maxAge?: number;
	price: number;
}

export interface ExperienceSnapshot {
	name: string;
	days: number;
	nights: number;
	ageGroupPricing: AgeGroupPricing[];
}

export interface ExperienceInfo {
	experienceId: string;
	experienceSnapshot: ExperienceSnapshot;
}

export interface BookingPricing {
	subtotal: number;
	total: number;
	discountAmount?: number;
	taxAmount?: number;
	feeAmount?: number;
	currency: string;
}

export interface AgeGroupInfo {
	code: AgeGroupCode;
	quantity: number;
}

export interface TravelerInfo {
	firstName: string;
	lastName: string;
	country: string;
	birthDate: Date;
}

export interface GuestsInfo {
	ageGroups: AgeGroupInfo[];
	totalGuests: number;
	travelersInfo: TravelerInfo[];
	arrivalPlace?: string;
	language: ExperienceLanguage;
}

export interface BookingPaymentInfo {
	method: PaymentMethod;
	amountAuthorized?: number;
	amountCaptured?: number;
	amountRefunded?: number;
	provider?: PaymentProvider;
	status: PaymentStatus;
	providerTransactionId?: string;
	paidAt?: Date;
}

export class Booking {
	constructor(
		public id: string,
		public customerInfo: CustomerInfo,
		public status: BookingStatus,
		public experienceDate: Date,
		public experience: ExperienceInfo,
		public pricing: BookingPricing,
		public guestsInfo: GuestsInfo,
		public payment: BookingPaymentInfo,
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}

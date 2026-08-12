import { Document, Schema } from 'mongoose';
import { PersonType } from '../../domain/enums/PersonType';
import { SellerStatus } from '../../domain/enums/SellerStatus';

// Don't define _id - let MongoDB generate it automatically as ObjectId
// userId is a foreign key to Account (references Account._id)
export const SellerProfileSchema = new Schema({
	userId: { type: String, required: true, unique: true }, // FK to Account._id
	name: String,
	typePerson: {
		type: String,
		enum: Object.values(PersonType),
		required: true,
	},
	numberDocument: String,
	ruc: String,
	address: String,
	phoneNumber: String,
	status: {
		type: String,
		enum: Object.values(SellerStatus),
		default: SellerStatus.PENDING,
	},
	rejectionReason: { type: String, required: false },
});

export interface SellerProfileDocument extends Document {
	userId: string;
	name: string;
	typePerson: PersonType;
	numberDocument: string;
	ruc: string;
	address: string;
	phoneNumber: string;
	status: SellerStatus;
	rejectionReason?: string;
}

import { Schema } from 'mongoose';
import { BankAccountStatus } from '../../domain/enums/BankAccountStatus';
import { BankAccountType } from '../../domain/enums/BankAccountType';

export const BankAccountSchema = new Schema({
	_id: String,
	id: String,
	sellerId: String,
	status: {
		type: String,
		enum: Object.values(BankAccountStatus),
		required: true,
	},
	type: {
		type: String,
		enum: Object.values(BankAccountType),
		required: true,
	},
	cci: String,
	bank: String,
});

export interface BankAccountDocument extends Document {
	_id: string;
	id: string;
	sellerId: string;
	status: BankAccountStatus;
	type: BankAccountType;
	cci: string;
	bank: string;
}

import { Document, Schema } from 'mongoose';
import { AccountRole } from '../../domain/enums/AccountRole';
import { AccountStatus } from '../../domain/enums/AccountStatus';

// Don't define _id - let MongoDB generate it automatically as ObjectId
export const AccountSchema = new Schema({
	name: String,
	email: { type: String, required: true, unique: true },
	password: String,
	type: [
		{
			type: String,
			enum: Object.values(AccountRole),
			required: true,
		},
	],
	status: {
		type: String,
		enum: Object.values(AccountStatus),
		required: true,
	},
});

export interface AccountDocument extends Document {
	name: string;
	email: string;
	password: string;
	type: AccountRole[];
	status: AccountStatus;
}

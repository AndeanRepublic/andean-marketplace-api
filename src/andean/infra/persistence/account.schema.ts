import { Document, Schema, Types } from 'mongoose';
import { AccountRole } from '../../domain/enums/AccountRole';
import { AccountStatus } from '../../domain/enums/AccountStatus';

export const AccountSchema = new Schema({
	_id: String,
	userId: String,
	name: String,
	email: String,
	password: String,
	type: [{
		type: String,
		enum: Object.values(AccountRole),
		required: true,
	}],
	status: {
		type: String,
		enum: Object.values(AccountStatus),
		required: true,
	},
});

export interface AccountDocument extends Document<string> {
	_id: string;
	userId: string;
	name: string;
	email: string;
	password: string;
	type: AccountRole[];
	status: AccountStatus;
}

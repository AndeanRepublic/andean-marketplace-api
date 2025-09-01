import { Document, Schema } from 'mongoose';
import { AccountType } from '../../domain/enums/AccountType';
import { AccountStatus } from '../../domain/enums/AccountStatus';

export const AccountSchema = new Schema({
  _id: String,
  userId: String,
  password: String,
  type: {
    type: String,
    enum: Object.values(AccountType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(AccountStatus),
    required: true,
  },
});

export interface AccountDocument extends Document {
  _id: string;
  userId: string;
  password: string;
  type: AccountType;
  status: AccountStatus;
}

import { Document, Schema } from 'mongoose';
import { CoinType } from '../../domain/enums/CoinType';

export const CustomerProfileSchema = new Schema({
  _id: String,
  id: String,
  userId: String,
  name: String,
  country: String,
  phoneNumber: String,
  language: String,
  coin: {
    type: String,
    enum: Object.values(CoinType),
    required: true,
  },
});

export interface CustomerProfileDocument extends Document {
  _id: string;
  id: string;
  userId: string;
  name: string;
  country: string;
  phoneNumber: string;
  language: string;
  coin: CoinType;
}

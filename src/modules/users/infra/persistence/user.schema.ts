import { Document, Schema } from 'mongoose';

export const UserSchema = new Schema({
  _id: String,
  id: String,
  name: String,
  country: String,
  email: String,
  phoneNumber: String,
  language: String,
  coin: String,
});

export interface UserDocument extends Document {
  _id: string;
  id: string;
  name: string;
  country: string;
  email: string;
  phoneNumber: string;
  language: string;
  coin: string;
}

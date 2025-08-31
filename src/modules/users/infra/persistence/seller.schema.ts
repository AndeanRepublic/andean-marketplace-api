import { Document, Schema } from 'mongoose';

export const SellerSchema = new Schema({
  _id: String,
  id: String,
  typePerson: String,
  numberDocument: String,
  ruc: String,
  commercialName: String,
  address: String,
  phoneNumber: String,
  email: String,
});

export interface SellerDocument extends Document {
  _id: string;
  id: string;
  typePerson: string;
  numberDocument: string;
  ruc: string;
  commercialName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

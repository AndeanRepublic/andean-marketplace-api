import { Document, Schema } from 'mongoose';
import { PersonType } from '../../domain/enums/PersonType';

export const SellerSchema = new Schema({
  _id: String,
  id: String,
  typePerson: {
    type: String,
    enum: Object.values(PersonType),
    required: true,
  },
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
  typePerson: PersonType;
  numberDocument: string;
  ruc: string;
  commercialName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

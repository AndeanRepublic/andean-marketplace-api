import { Document, Schema } from 'mongoose';
import { TypePerson } from '../../domain/enums/TypePerson';

export const SellerSchema = new Schema({
  _id: String,
  id: String,
  typePerson: {
    type: String,
    enum: Object.values(TypePerson),
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
  typePerson: TypePerson;
  numberDocument: string;
  ruc: string;
  commercialName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

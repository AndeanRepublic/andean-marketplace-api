import { Document, Schema } from 'mongoose';
import { PersonType } from '../../domain/enums/PersonType';

export const SellerProfileSchema = new Schema({
  _id: String,
  id: String,
  userId: String,
  name: String,
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
});

export interface SellerProfileDocument extends Document {
  _id: string;
  id: string;
  userId: string;
  name: string;
  typePerson: PersonType;
  numberDocument: string;
  ruc: string;
  commercialName: string;
  address: string;
  phoneNumber: string;
}

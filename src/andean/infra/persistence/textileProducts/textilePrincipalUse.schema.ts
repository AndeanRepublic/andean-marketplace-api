import { Document, Schema } from 'mongoose';

export const TextilePrincipalUseSchema = new Schema({
  _id: String,
  id: String,
  name: String,
});

export interface TextilePrincipalUseDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
}

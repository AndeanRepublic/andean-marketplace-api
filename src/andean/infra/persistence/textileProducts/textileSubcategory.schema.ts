import { Document, Schema } from 'mongoose';

export const TextileSubcategorySchema = new Schema({
  _id: String,
  id: String,
  name: String,
});

export interface TextileSubcategoryDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
}

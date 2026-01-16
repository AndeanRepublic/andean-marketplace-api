import { Document, Schema } from 'mongoose';

export const TextileTypeSchema = new Schema({
  _id: String,
  id: String,
  name: String,
});

export interface TextileTypeDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
}

import { Document, Schema } from 'mongoose';

export const TextileStyleSchema = new Schema({
  _id: String,
  id: String,
  name: String,
});

export interface TextileStyleDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
}

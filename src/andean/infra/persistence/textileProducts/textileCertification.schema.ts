import { Document, Schema } from 'mongoose';

export const TextileCertificationSchema = new Schema({
  _id: String,
  id: String,
  name: String,
  createdAt: Date,
  updatedAt: Date,
});

export interface TextileCertificationDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

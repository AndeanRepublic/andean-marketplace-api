import { Document, Schema } from 'mongoose';

export const TextileCraftTechniqueSchema = new Schema({
  _id: String,
  id: String,
  name: String,
});

export interface TextileCraftTechniqueDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
}

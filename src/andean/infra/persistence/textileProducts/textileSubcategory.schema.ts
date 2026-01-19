import { Document, Schema } from 'mongoose';

export const TextileSubcategorySchema = new Schema({
	name: String,
});

export interface TextileSubcategoryDocument extends Document {
	name: string;
}

import { Document, Schema } from 'mongoose';

export const TextileTypeSchema = new Schema({
	name: String,
});

export interface TextileTypeDocument extends Document {
	name: string;
}

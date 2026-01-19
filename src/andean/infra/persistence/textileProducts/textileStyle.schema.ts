import { Document, Schema } from 'mongoose';

export const TextileStyleSchema = new Schema({
	name: String,
});

export interface TextileStyleDocument extends Document {
	name: string;
}

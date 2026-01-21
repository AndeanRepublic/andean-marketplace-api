import { Document, Schema } from 'mongoose';

export const SizeOptionAlternativeSchema = new Schema({
	nameLabel: String,
});

export interface SizeOptionAlternativeDocument extends Document {
	nameLabel: string;
}

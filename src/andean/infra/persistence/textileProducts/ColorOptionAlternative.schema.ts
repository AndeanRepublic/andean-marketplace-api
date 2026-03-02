import { Document, Schema } from 'mongoose';

export const ColorOptionAlternativeSchema = new Schema({
	nameLabel: String,
	hexCode: String,
});

export interface ColorOptionAlternativeDocument extends Document {
	nameLabel: string;
	hexCode: string;
}

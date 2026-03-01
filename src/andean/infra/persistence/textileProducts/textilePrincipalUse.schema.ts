import { Document, Schema } from 'mongoose';

export const TextilePrincipalUseSchema = new Schema({
	name: String,
});

export interface TextilePrincipalUseDocument extends Document {
	name: string;
}

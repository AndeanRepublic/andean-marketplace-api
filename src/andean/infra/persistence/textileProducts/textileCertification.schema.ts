import { Document, Schema } from 'mongoose';

export const TextileCertificationSchema = new Schema({
	name: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface TextileCertificationDocument extends Document {
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

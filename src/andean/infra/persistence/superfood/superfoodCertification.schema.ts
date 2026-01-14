import { Document, Schema } from 'mongoose';

export const SuperfoodCertificationSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodCertificationDocument extends Document {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

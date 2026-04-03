import { Document, Schema } from 'mongoose';

export const SuperfoodCertificationSchema = new Schema({
	name: { type: String, required: true },
	certifyingEntity: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export interface SuperfoodCertificationDocument extends Document {
	name: string;
	certifyingEntity?: string;
	createdAt: Date;
	updatedAt: Date;
}

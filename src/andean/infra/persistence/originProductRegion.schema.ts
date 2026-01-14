import { Document, Schema } from 'mongoose';

export const OriginProductRegionSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
});

export interface OriginProductRegionDocument extends Document {
	id: string;
	name: string;
}

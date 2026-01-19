import { Document, Schema } from 'mongoose';

export const TextileCraftTechniqueSchema = new Schema({
	name: String,
});

export interface TextileCraftTechniqueDocument extends Document {
	name: string;
}

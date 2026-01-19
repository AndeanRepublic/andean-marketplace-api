import { Document, Schema } from 'mongoose';
import { TextileCategoryStatus } from 'src/andean/domain/enums/TextileCategoryStatus';

export const TextileCategorySchema = new Schema({
	name: String,
	status: {
		type: String,
		enum: Object.values(TextileCategoryStatus),
		required: true,
	},
});

export interface TextileCategoryDocument extends Document {
	name: string;
	status: TextileCategoryStatus;
}

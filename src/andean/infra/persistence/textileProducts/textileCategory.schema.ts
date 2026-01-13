import { Document, Schema } from 'mongoose';
import { TextileCategoryStatus } from 'src/andean/domain/enums/TextileCategoryStatus';

export const TextileCategorySchema = new Schema({
  _id: String,
  id: String,
  name: String,
  status: {
    type: String,
    enum: Object.values(TextileCategoryStatus),
    required: true,
  },
});

export interface TextileCategoryDocument extends Document<string> {
  _id: string;
  id: string;
  name: string;
  status: TextileCategoryStatus;
}

import { Document, Schema } from 'mongoose';

export const SuperfoodSizeOptionAlternativeSchema = new Schema({
	nameLabel: { type: String, required: true },
	sizeNumber: { type: Number, required: true },
	sizeUnit: { type: String, enum: ['g', 'mg', 'kg'], required: true },
	servingsPerContainer: { type: Number, required: true },
});

export interface SuperfoodSizeOptionAlternativeDocument extends Document {
	nameLabel: string;
	sizeNumber: number;
	sizeUnit: 'g' | 'mg' | 'kg';
	servingsPerContainer: number;
}

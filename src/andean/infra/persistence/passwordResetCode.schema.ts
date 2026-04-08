import { Document, Schema, Types } from 'mongoose';

export const PasswordResetCodeSchema = new Schema({
	email: { type: String, required: true, index: true },
	code: { type: String, required: true },
	accountId: { type: Types.ObjectId, ref: 'Account', required: true },
	attempts: { type: Number, default: 0 },
	expiresAt: { type: Date, required: true, expires: 0 },
	usedAt: { type: Date, default: null },
	createdAt: { type: Date, default: Date.now },
});

PasswordResetCodeSchema.index({ email: 1, code: 1 });

export interface PasswordResetCodeDocument extends Document {
	email: string;
	code: string;
	accountId: Types.ObjectId;
	attempts: number;
	expiresAt: Date;
	usedAt: Date | null;
	createdAt: Date;
}

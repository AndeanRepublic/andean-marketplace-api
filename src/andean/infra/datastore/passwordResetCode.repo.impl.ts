import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	PasswordResetCodeRepository,
	PasswordResetCodeData,
	PasswordResetCodeRecord,
} from '../../app/datastore/PasswordResetCode.repo';
import { PasswordResetCodeDocument } from '../persistence/passwordResetCode.schema';

@Injectable()
export class PasswordResetCodeRepoImpl extends PasswordResetCodeRepository {
	constructor(
		@InjectModel('PasswordResetCode')
		private readonly passwordResetCodeModel: Model<PasswordResetCodeDocument>,
	) {
		super();
	}

	async create(data: PasswordResetCodeData): Promise<void> {
		await new this.passwordResetCodeModel({
			email: data.email,
			code: data.code,
			accountId: data.accountId,
			expiresAt: data.expiresAt,
		}).save();
	}

	async findByEmailAndCode(
		email: string,
		code: string,
	): Promise<PasswordResetCodeRecord | null> {
		const doc = await this.passwordResetCodeModel
			.findOne({ email, code })
			.exec();

		if (!doc) return null;

		return {
			id: doc._id.toString(),
			email: doc.email,
			code: doc.code,
			accountId: doc.accountId.toString(),
			attempts: doc.attempts,
			expiresAt: doc.expiresAt,
			usedAt: doc.usedAt,
		};
	}

	async findByEmailActive(
		email: string,
	): Promise<PasswordResetCodeRecord | null> {
		const now = new Date();
		const doc = await this.passwordResetCodeModel
			.findOne({ email, usedAt: null, expiresAt: { $gt: now } })
			.sort({ createdAt: -1 })
			.exec();

		if (!doc) return null;

		return {
			id: doc._id.toString(),
			email: doc.email,
			code: doc.code,
			accountId: doc.accountId.toString(),
			attempts: doc.attempts,
			expiresAt: doc.expiresAt,
			usedAt: doc.usedAt,
		};
	}

	async incrementAttempts(id: string): Promise<number> {
		const result = await this.passwordResetCodeModel
			.findByIdAndUpdate(id, { $inc: { attempts: 1 } }, { new: true })
			.exec();
		return result?.attempts ?? 0;
	}

	async markAsUsed(email: string, code: string): Promise<void> {
		await this.passwordResetCodeModel
			.updateOne({ email, code }, { usedAt: new Date() })
			.exec();
	}
}

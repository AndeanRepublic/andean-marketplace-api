import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerProfileRepository } from '../../app/datastore/Seller.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellerProfileDocument } from '../persistence/sellerProfileSchema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { SellerProfileMapper } from '../services/SellerProfileMapper';
import { SellerStatus } from '../../domain/enums/SellerStatus';

@Injectable()
export class SellerProfileRepositoryImpl extends SellerProfileRepository {
	constructor(
		@InjectModel('SellerProfile')
		private readonly sellerModel: Model<SellerProfileDocument>,
	) {
		super();
	}

	async getSellerById(id: string): Promise<SellerProfile | null> {
		const doc = await this.sellerModel.findById(id).exec();
		return doc ? SellerProfileMapper.fromDocument(doc) : null;
	}

	async getSellerByUserId(userId: string): Promise<SellerProfile | null> {
		const doc = await this.sellerModel.findOne({ userId }).exec();
		return doc ? SellerProfileMapper.fromDocument(doc) : null;
	}

	async saveSeller(seller: SellerProfile): Promise<SellerProfile> {
		const created = new this.sellerModel(
			SellerProfileMapper.toPersistence(seller),
		);
		const savedSeller = await created.save();
		return SellerProfileMapper.fromDocument(savedSeller);
	}

	async updateSellerByUserId(
		userId: string,
		profile: SellerProfile,
	): Promise<void> {
		await this.sellerModel.findOneAndUpdate(
			{ userId },
			SellerProfileMapper.toPersistence(profile),
			{ new: true },
		);
	}

	async getAllSellers(): Promise<SellerProfile[]> {
		const docs = await this.sellerModel.find().exec();
		return docs.map((doc) => SellerProfileMapper.fromDocument(doc));
	}

	async getSellerByPhoneNumber(
		phoneNumber: string,
	): Promise<SellerProfile | null> {
		const doc = await this.sellerModel.findOne({ phoneNumber }).exec();
		return doc ? SellerProfileMapper.fromDocument(doc) : null;
	}

	async updateStatusByUserId(
		userId: string,
		status: SellerStatus,
	): Promise<SellerProfile> {
		return this.updateReviewByUserId(userId, status);
	}

	async updateReviewByUserId(
		userId: string,
		status: SellerStatus,
		rejectionReason?: string,
	): Promise<SellerProfile> {
		const update: { status: SellerStatus; rejectionReason?: string | null } = {
			status,
		};
		if (status === SellerStatus.REJECTED) {
			update.rejectionReason = rejectionReason;
		} else {
			update.rejectionReason = null;
		}

		const doc = await this.sellerModel
			.findOneAndUpdate({ userId }, { $set: update }, { new: true })
			.exec();
		if (!doc) {
			throw new NotFoundException('Seller profile not found');
		}
		return SellerProfileMapper.fromDocument(doc);
	}
}

import { Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../app/datastore/Seller.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellerProfileDocument } from '../persistence/sellerProfileSchema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { SellerProfileMapper } from '../services/SellerProfileMapper';

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
}

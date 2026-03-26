import { Injectable } from '@nestjs/common';
import { CustomerProfileRepository } from '../../app/datastore/Customer.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomerProfileDocument } from '../persistence/customerProfileSchema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CustomerProfileMapper } from '../services/CustomerProfileMapper';

@Injectable()
export class CustomerProfileRepositoryImpl extends CustomerProfileRepository {
	constructor(
		@InjectModel('CustomerProfile')
		private readonly userModel: Model<CustomerProfileDocument>,
	) {
		super();
	}

	async saveCustomer(user: CustomerProfile): Promise<CustomerProfile> {
		const created = new this.userModel(
			CustomerProfileMapper.toPersistence(user),
		);
		const savedCustomer = await created.save();
		return CustomerProfileMapper.fromDocument(savedCustomer);
	}

	async getCustomerById(id: string): Promise<CustomerProfile | null> {
		const doc = await this.userModel.findById(id).exec();
		return doc ? CustomerProfileMapper.fromDocument(doc) : null;
	}

	async getAllCustomers(): Promise<CustomerProfile[]> {
		const docs = await this.userModel.find().exec();
		return docs.map((doc) => CustomerProfileMapper.fromDocument(doc));
	}

	async getCustomerByUserId(userId: string): Promise<CustomerProfile | null> {
		const doc = await this.userModel.findOne({ userId }).exec();
		return doc ? CustomerProfileMapper.fromDocument(doc) : null;
	}

	async getCustomerByPhoneNumber(
		phoneNumber: string,
	): Promise<CustomerProfile | null> {
		const doc = await this.userModel.findOne({ phoneNumber }).exec();
		return doc ? CustomerProfileMapper.fromDocument(doc) : null;
	}

	async updateCustomerById(
		userId: string,
		profile: CustomerProfile,
	): Promise<void> {
		await this.userModel.findOneAndUpdate(
			{ userId },
			CustomerProfileMapper.toPersistence(profile),
			{ new: true },
		);
	}
}

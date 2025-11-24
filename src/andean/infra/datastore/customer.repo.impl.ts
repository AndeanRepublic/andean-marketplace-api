import { Injectable } from '@nestjs/common';
import { CustomerProfileRepository } from '../../app/datastore/Customer.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return CustomerProfileMapper.toDomain(savedCustomer);
  }

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async getAllCustomers(): Promise<CustomerProfile[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((doc) => CustomerProfileMapper.toDomain(doc));
  }

  async getCustomerByUserId(userId: string): Promise<CustomerProfile | null> {
    return this.userModel.findOne({ userId: userId }).exec();
  }

  async getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<CustomerProfile | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
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

import { Injectable } from '@nestjs/common';
import { CustomerProfileRepository } from '../../app/datastore/Customer.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../persistence/user.schema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CustomerProfileMapper } from '../services/CustomerProfileMapper';

@Injectable()
export class CustomerProfileRepositoryImpl extends CustomerProfileRepository {
  constructor(
    @InjectModel('CustomerProfile')
    private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async saveCustomer(user: CustomerProfile): Promise<CustomerProfile> {
    const created = new this.userModel({
      _id: crypto.randomUUID(),
      id: user.id,
      name: user.name,
      country: user.country,
      phoneNumber: user.phoneNumber,
      language: user.language,
      coin: user.coin,
    });
    const savedCustomerProfile = await created.save();
    return new CustomerProfile(
      user.id,
      savedCustomerProfile.name,
      savedCustomerProfile.country,
      savedCustomerProfile.phoneNumber,
      savedCustomerProfile.language,
      savedCustomerProfile.coin,
    );
  }

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async getAllCustomers(): Promise<CustomerProfile[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((doc) => CustomerProfileMapper.toDomain(doc));
  }

  async getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<CustomerProfile | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }
}

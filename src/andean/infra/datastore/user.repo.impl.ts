import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../app/datastore/Customer.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../persistence/user.schema';
import { Customer } from '../../domain/entities/Customer';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectModel('Customer') private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async saveCustomer(user: Customer): Promise<Customer> {
    const created = new this.userModel({
      _id: crypto.randomUUID(),
      id: user.id,
      name: user.name,
      country: user.country,
      phoneNumber: user.phoneNumber,
      email: user.email,
      language: user.language,
      coin: user.coin,
    });
    const savedUser = await created.save();
    return new Customer(
      user.id,
      savedUser.name,
      savedUser.country,
      savedUser.phoneNumber,
      savedUser.email,
      savedUser.language,
      savedUser.coin,
    );
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async getAllCustomers(): Promise<Customer[]> {
    const docs = await this.userModel.find().exec();
    return docs.map(
      (doc) =>
        new Customer(
          doc.id,
          doc.name,
          doc.country,
          doc.phoneNumber,
          doc.email,
          doc.language,
          doc.coin,
        ),
    );
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<Customer | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }
}

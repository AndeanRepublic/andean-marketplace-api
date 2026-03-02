import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../app/datastore/User.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../persistence/user.schema';
import { User } from '../../domain/entities/user';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }
  async saveUser(user: User): Promise<User> {
    const created = new this.userModel({
      _id: user.id,
      id: user.id,
      name: user.name,
      country: user.country,
      phoneNumber: user.phoneNumber,
      email: user.email,
      language: user.language,
      coin: user.coin,
    });
    const savedUser = await created.save();
    return new User(
      savedUser._id,
      savedUser.name,
      savedUser.country,
      savedUser.phoneNumber,
      savedUser.email,
      savedUser.language,
      savedUser.coin,
    );
  }
  async getAllUsers(): Promise<User[]> {
    const docs = await this.userModel.find().exec();
    return docs.map(
      (doc) =>
        new User(
          doc._id,
          doc.name,
          doc.country,
          doc.phoneNumber,
          doc.email,
          doc.language,
          doc.coin,
        ),
    );
  }
}

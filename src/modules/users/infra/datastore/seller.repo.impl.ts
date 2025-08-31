import { Injectable } from '@nestjs/common';
import { SellerRepository } from '../../app/datastore/Seller.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellerDocument } from '../persistence/seller.schema';
import { Seller } from '../../domain/entities/seller';
import { AccountStatus } from '../../domain/enums/AccountStatus';

@Injectable()
export class SellerRepositoryImpl extends SellerRepository {
  constructor(
    @InjectModel('Seller') private readonly sellerModel: Model<SellerDocument>,
  ) {
    super();
  }

  async saveSeller(seller: Seller): Promise<Seller> {
    const created = new this.sellerModel({
      _id: crypto.randomUUID(),
      id: seller.id,
      typePerson: seller.typePerson,
      numberDocument: seller.numberDocument,
      ruc: seller.ruc,
      commercialName: seller.commercialName,
      address: seller.address,
      phoneNumber: seller.phoneNumber,
      email: seller.email,
      accountStatus: AccountStatus.DISABLED,
    });
    const savedSeller = await created.save();
    return new Seller(
      seller.id,
      savedSeller.typePerson,
      savedSeller.numberDocument,
      savedSeller.ruc,
      savedSeller.commercialName,
      savedSeller.address,
      savedSeller.phoneNumber,
      savedSeller.email,
      AccountStatus.DISABLED,
    );
  }

  async getAllSellers(): Promise<Seller[]> {
    const docs = await this.sellerModel.find().exec();
    return docs.map(
      (doc) =>
        new Seller(
          doc.id,
          doc.typePerson,
          doc.numberDocument,
          doc.ruc,
          doc.commercialName,
          doc.address,
          doc.phoneNumber,
          doc.email,
          doc.accountStatus,
        ),
    );
  }

  async getSellerByEmail(email: string): Promise<Seller | null> {
    return this.sellerModel.findOne({ email }).exec();
  }

  async getSellerByPhoneNumber(phoneNumber: string): Promise<Seller | null> {
    return this.sellerModel.findOne({ phoneNumber }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../app/datastore/Seller.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellerDocument } from '../persistence/seller.schema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { CustomerProfileMapper } from '../services/SellerProfileMapper';

@Injectable()
export class SellerProfileRepositoryImpl extends SellerProfileRepository {
  constructor(
    @InjectModel('Seller') private readonly sellerModel: Model<SellerDocument>,
  ) {
    super();
  }

  async getSellerById(id: string): Promise<SellerProfile | null> {
    return this.sellerModel.findOne({ id }).exec();
  }

  async saveSeller(seller: SellerProfile): Promise<SellerProfile> {
    const created = new this.sellerModel({
      _id: crypto.randomUUID(),
      id: seller.id,
      typePerson: seller.typePerson,
      numberDocument: seller.numberDocument,
      ruc: seller.ruc,
      commercialName: seller.commercialName,
      address: seller.address,
      phoneNumber: seller.phoneNumber,
    });

    const savedSeller = await created.save();
    return new SellerProfile(
      seller.id,
      seller.name,
      savedSeller.typePerson,
      savedSeller.numberDocument,
      savedSeller.ruc,
      savedSeller.commercialName,
      savedSeller.address,
      savedSeller.phoneNumber,
    );
  }

  async getAllSellers(): Promise<SellerProfile[]> {
    const docs = await this.sellerModel.find().exec();
    return docs.map((doc) => CustomerProfileMapper.toDomain(doc));
  }

  async getSellerByPhoneNumber(
    phoneNumber: string,
  ): Promise<SellerProfile | null> {
    return this.sellerModel.findOne({ phoneNumber }).exec();
  }
}

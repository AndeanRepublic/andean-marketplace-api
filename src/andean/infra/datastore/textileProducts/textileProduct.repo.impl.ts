import { Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileProductDocument } from '../../persistence/textileProducts/textileProduct.schema';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileProductMapper } from '../../services/textileProducts/TextileProductMapper';

@Injectable()
export class TextileProductRepositoryImpl extends TextileProductRepository {
  constructor(
    @InjectModel('TextileProduct')
    private readonly textileProductModel: Model<TextileProductDocument>,
  ) {
    super();
  }

  async getAllTextileProducts(): Promise<TextileProduct[]> {
    const docs = await this.textileProductModel.find().exec();
    return docs.map((doc) => TextileProductMapper.fromDocument(doc));
  }

  async getTextileProductById(id: string): Promise<TextileProduct | null> {
    const doc = await this.textileProductModel.findOne({ id }).exec();
    return doc ? TextileProductMapper.fromDocument(doc) : null;
  }

  async saveTextileProduct(product: TextileProduct): Promise<TextileProduct> {
    const plain = TextileProductMapper.toPersistence(product);
    const created = new this.textileProductModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const savedProduct = await created.save();
    return TextileProductMapper.fromDocument(savedProduct);
  }

  async updateTextileProduct(
    id: string,
    product: TextileProduct,
  ): Promise<TextileProduct> {
    const plain = TextileProductMapper.toPersistence(product);
    const updated = await this.textileProductModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    return TextileProductMapper.fromDocument(updated!);
  }

  async deleteTextileProduct(id: string): Promise<void> {
    await this.textileProductModel.deleteOne({ id }).exec();
    return;
  }
}

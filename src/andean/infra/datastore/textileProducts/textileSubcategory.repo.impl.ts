import { Injectable } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../../app/datastore/textileProducts/TextileSubcategory.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileSubcategoryDocument } from '../../persistence/textileProducts/textileSubcategory.schema';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { TextileSubcategoryMapper } from '../../services/textileProducts/TextileSubcategoryMapper';

@Injectable()
export class TextileSubcategoryRepositoryImpl extends TextileSubcategoryRepository {
  constructor(
    @InjectModel('TextileSubcategory')
    private readonly textileSubcategoryModel: Model<TextileSubcategoryDocument>,
  ) {
    super();
  }

  async getAllTextileSubcategories(): Promise<TextileSubcategory[]> {
    const docs = await this.textileSubcategoryModel.find().exec();
    return docs.map((doc) => TextileSubcategoryMapper.fromDocument(doc));
  }

  async getTextileSubcategoryById(id: string): Promise<TextileSubcategory | null> {
    const doc = await this.textileSubcategoryModel.findOne({ id }).exec();
    return doc ? TextileSubcategoryMapper.fromDocument(doc) : null;
  }

  async saveTextileSubcategory(subcategory: TextileSubcategory): Promise<TextileSubcategory> {
    const plain = TextileSubcategoryMapper.toPersistence(subcategory);
    const created = new this.textileSubcategoryModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const savedSubcategory = await created.save();
    return TextileSubcategoryMapper.fromDocument(savedSubcategory);
  }

  async updateTextileSubcategory(id: string, subcategory: TextileSubcategory): Promise<TextileSubcategory> {
    const plain = TextileSubcategoryMapper.toPersistence(subcategory);
    const updated = await this.textileSubcategoryModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    return TextileSubcategoryMapper.fromDocument(updated!);
  }

  async deleteTextileSubcategory(id: string): Promise<void> {
    await this.textileSubcategoryModel.deleteOne({ id }).exec();
    return;
  }
}

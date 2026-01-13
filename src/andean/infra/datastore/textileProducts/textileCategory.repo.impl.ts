import { Injectable } from '@nestjs/common';
import { TextileCategoryRepository } from '../../../app/datastore/textileProducts/TextileCategory.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileCategoryDocument } from '../../persistence/textileProducts/textileCategory.schema';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryMapper } from '../../services/textileProducts/TextileCategoryMapper';

@Injectable()
export class TextileCategoryRepositoryImpl extends TextileCategoryRepository {
  constructor(
    @InjectModel('TextileCategory')
    private readonly textileCategoryModel: Model<TextileCategoryDocument>,
  ) {
    super();
  }

  async getAllCategories(): Promise<TextileCategory[]> {
    const docs = await this.textileCategoryModel.find().exec();
    return docs.map((doc) => TextileCategoryMapper.fromDocument(doc));
  }

  async getCategoryById(id: string): Promise<TextileCategory | null> {
    const doc = await this.textileCategoryModel.findOne({ id }).exec();
    return doc ? TextileCategoryMapper.fromDocument(doc) : null;
  }

  async saveCategory(category: TextileCategory): Promise<TextileCategory> {
    const plain = TextileCategoryMapper.toPersistence(category);
    const created = new this.textileCategoryModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const savedCategory = await created.save();
    return TextileCategoryMapper.fromDocument(savedCategory);
  }

  async updateCategory(
    id: string,
    category: TextileCategory,
  ): Promise<TextileCategory> {
    const plain = TextileCategoryMapper.toPersistence(category);
    const updated = await this.textileCategoryModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    return TextileCategoryMapper.fromDocument(updated!);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.textileCategoryModel.deleteOne({ id }).exec();
    return;
  }
}

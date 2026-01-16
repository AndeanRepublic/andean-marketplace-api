import { Injectable } from '@nestjs/common';
import { TextileTypeRepository } from '../../../app/datastore/textileProducts/TextileType.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileTypeDocument } from '../../persistence/textileProducts/textileType.schema';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeMapper } from '../../services/textileProducts/TextileTypeMapper';

@Injectable()
export class TextileTypeRepositoryImpl extends TextileTypeRepository {
  constructor(
    @InjectModel('TextileType')
    private readonly textileTypeModel: Model<TextileTypeDocument>,
  ) {
    super();
  }

  async getAllTextileTypes(): Promise<TextileType[]> {
    const docs = await this.textileTypeModel.find().exec();
    return docs.map((doc) => TextileTypeMapper.fromDocument(doc));
  }

  async getTextileTypeById(id: string): Promise<TextileType | null> {
    const doc = await this.textileTypeModel.findOne({ id }).exec();
    return doc ? TextileTypeMapper.fromDocument(doc) : null;
  }

  async saveTextileType(type: TextileType): Promise<TextileType> {
    const plain = TextileTypeMapper.toPersistence(type);
    const created = new this.textileTypeModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const savedType = await created.save();
    return TextileTypeMapper.fromDocument(savedType);
  }

  async updateTextileType(id: string, type: TextileType): Promise<TextileType> {
    const plain = TextileTypeMapper.toPersistence(type);
    const updated = await this.textileTypeModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    return TextileTypeMapper.fromDocument(updated!);
  }

  async deleteTextileType(id: string): Promise<void> {
    await this.textileTypeModel.deleteOne({ id }).exec();
    return;
  }
}

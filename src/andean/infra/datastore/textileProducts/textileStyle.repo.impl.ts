import { Injectable } from '@nestjs/common';
import { TextileStyleRepository } from '../../../app/datastore/textileProducts/TextileStyle.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileStyleDocument } from '../../persistence/textileProducts/textileStyle.schema';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleMapper } from '../../services/textileProducts/TextileStyleMapper';

@Injectable()
export class TextileStyleRepositoryImpl extends TextileStyleRepository {
  constructor(
    @InjectModel('TextileStyle')
    private readonly textileStyleModel: Model<TextileStyleDocument>,
  ) {
    super();
  }

  async getAllTextileStyles(): Promise<TextileStyle[]> {
    const docs = await this.textileStyleModel.find().exec();
    return docs.map((doc) => TextileStyleMapper.fromDocument(doc));
  }

  async getTextileStyleById(id: string): Promise<TextileStyle | null> {
    const doc = await this.textileStyleModel.findOne({ id }).exec();
    return doc ? TextileStyleMapper.fromDocument(doc) : null;
  }

  async saveTextileStyle(style: TextileStyle): Promise<TextileStyle> {
    const plain = TextileStyleMapper.toPersistence(style);
    const created = new this.textileStyleModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const savedStyle = await created.save();
    return TextileStyleMapper.fromDocument(savedStyle);
  }

  async updateTextileStyle(id: string, style: TextileStyle): Promise<TextileStyle> {
    const plain = TextileStyleMapper.toPersistence(style);
    const updated = await this.textileStyleModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    return TextileStyleMapper.fromDocument(updated!);
  }

  async deleteTextileStyle(id: string): Promise<void> {
    await this.textileStyleModel.deleteOne({ id }).exec();
    return;
  }
}

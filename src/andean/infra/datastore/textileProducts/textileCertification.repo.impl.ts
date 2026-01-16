import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TextileCertificationRepository } from '../../../app/datastore/textileProducts/TextileCertification.repo';
import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';
import { TextileCertificationDocument } from '../../persistence/textileProducts/textileCertification.schema';
import { TextileCertificationMapper } from '../../services/textileProducts/TextileCertificationMapper';
import * as crypto from 'crypto';

@Injectable()
export class TextileCertificationRepositoryImpl extends TextileCertificationRepository {
  constructor(
    @InjectModel('TextileCertification')
    private readonly textileCertificationModel: Model<TextileCertificationDocument>,
  ) {
    super();
  }

  async getAllTextileCertifications(): Promise<TextileCertification[]> {
    const docs = await this.textileCertificationModel.find().exec();
    return docs.map((doc: TextileCertificationDocument) =>
      TextileCertificationMapper.fromDocument(doc),
    );
  }

  async getTextileCertificationById(
    id: string,
  ): Promise<TextileCertification | null> {
    const doc = await this.textileCertificationModel.findOne({ id }).exec();
    return doc ? TextileCertificationMapper.fromDocument(doc) : null;
  }

  async saveTextileCertification(
    certification: TextileCertification,
  ): Promise<TextileCertification> {
    const plain = TextileCertificationMapper.toPersistence(certification);
    const created = new this.textileCertificationModel({
      _id: crypto.randomUUID(),
      ...plain,
    });
    const saved = await created.save();
    return TextileCertificationMapper.fromDocument(saved);
  }

  async updateTextileCertification(
    id: string,
    certification: TextileCertification,
  ): Promise<TextileCertification> {
    const plain = TextileCertificationMapper.toPersistence(certification);
    const updated = await this.textileCertificationModel
      .findOneAndUpdate({ id }, plain, { new: true })
      .exec();
    if (!updated) {
      throw new Error('TextileCertification not found');
    }
    return TextileCertificationMapper.fromDocument(updated);
  }

  async deleteTextileCertification(id: string): Promise<void> {
    await this.textileCertificationModel.deleteOne({ id }).exec();
  }
}

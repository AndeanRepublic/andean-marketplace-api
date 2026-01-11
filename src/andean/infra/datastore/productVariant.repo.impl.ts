import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from '../../app/datastore/ProductVariant.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductVariantDocument } from '../persistence/productVariant.schema';
import { ProductVariant } from 'src/andean/domain/entities/products/ProductVariant';
import { ProductVariantMapper } from '../services/ProductVariantMapper';

@Injectable()
export class ProductVariantRepoImpl extends ProductVariantRepository {
  constructor(
    @InjectModel('ProductVariant')
    private readonly variantModel: Model<ProductVariantDocument>,
  ) {
    super();
  }

  async getVariantById(id: string): Promise<ProductVariant | null> {
    const doc = await this.variantModel.findById(id).exec();
    return doc ? ProductVariantMapper.fromDocument(doc) : null;
  }

  async saveProductVariant(variant: ProductVariant): Promise<ProductVariant> {
    const persistence = ProductVariantMapper.toPersistence(variant);
    const created = new this.variantModel(persistence);
    const saved = await created.save();
    return ProductVariantMapper.fromDocument(saved);
  }

  async getVariantsByProductId(productId: string): Promise<ProductVariant[]> {
    const docs = await this.variantModel.find({ productId }).exec();
    return docs.map((doc) => ProductVariantMapper.fromDocument(doc));
  }

  async deleteProductVariant(id: string): Promise<void> {
    await this.variantModel.deleteOne({ id }).exec();
  }
}

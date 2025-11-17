import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../app/datastore/Product.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '../persistence/product.schema';
import { Product } from '../../domain/entities/products/Product';
import { ProductMapper } from '../services/ProductMapper';

@Injectable()
export class ProductRepoImpl extends ProductRepository {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {
    super();
  }

  async getAllBySellerId(sellerId: string): Promise<Product[]> {
    const docs = await this.productModel.find({ sellerId }).lean().exec();
    return docs.map((doc: ProductDocument) => ProductMapper.toDomain(doc));
  }

  async getAllByShopId(shopId: string): Promise<Product[]> {
    const docs = await this.productModel.find({ shopId }).exec();
    return docs.map((doc: ProductDocument) => ProductMapper.toDomain(doc));
  }

  async getProductById(id: string): Promise<Product | null> {
    const doc = await this.productModel.findById(id).lean().exec();
    return doc ? ProductMapper.toDomain(doc) : null;
  }

  async saveProduct(product: Product): Promise<Product> {
    const created = new this.productModel(ProductMapper.toPersistence(product));
    const savedProduct = await created.save();
    return ProductMapper.toDomain(savedProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }
}

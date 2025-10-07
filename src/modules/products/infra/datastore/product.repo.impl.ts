import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../app/datastore/product.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '../persistance/product.schema';
import { Product } from '../../domain/entities/Product';
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return docs.map((doc: ProductDocument) => ProductMapper.toDomain(doc));
  }

  async getAllByShopId(shopId: string): Promise<Product[]> {
    const docs = await this.productModel.find({ shopId }).exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return docs.map((doc: ProductDocument) => ProductMapper.toDomain(doc));
  }

  async getProductById(id: string): Promise<Product | null> {
    const doc = await this.productModel.findById(id).lean().exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return doc ? ProductMapper.toDomain(doc) : null;
  }

  async saveProduct(product: Product): Promise<Product> {
    const created = new this.productModel({
      _id: crypto.randomUUID(),
      id: product.id,
      shopId: product.shopId,
      sellerId: product.sellerId,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
    });
    const savedProduct = await created.save();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return ProductMapper.toDomain(savedProduct);
  }
}

import { ProductVariant } from '../../domain/entities/products/ProductVariant';

export abstract class ProductVariantRepository {
  abstract saveProductVariant(variant: ProductVariant): Promise<ProductVariant>;
  // abstract updateProductVariant(id: string): Promise<void>;
  abstract getVariantsByProductId(productId: string): Promise<ProductVariant[]>;
  abstract deleteProductVariant(id: string): Promise<void>;
}

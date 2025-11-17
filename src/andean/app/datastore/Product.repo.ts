import { Product } from '../../domain/entities/Product';

export abstract class ProductRepository {
  abstract getAllBySellerId(sellerId: string): Promise<Product[]>;
  abstract getAllByShopId(shopId: string): Promise<Product[]>;
  abstract getProductById(id: string): Promise<Product | null>;
  abstract saveProduct(product: Product): Promise<Product>;
  abstract deleteProduct(id: string): Promise<void>;
}

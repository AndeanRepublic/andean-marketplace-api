import { ProductDocument } from '../persistence/product.schema';
import { Product } from '../../domain/entities/Product';

export class ProductMapper {
  static toDomain(doc: ProductDocument): Product {
    return new Product(
      doc.id,
      doc.shopId,
      doc.sellerId,
      doc.name,
      doc.description,
      doc.price,
      doc.stock,
      doc.category,
      doc.status,
    );
  }
}

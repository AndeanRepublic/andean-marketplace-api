import { ProductDocument } from '../persistence/product.schema';
import { Product } from '../../domain/entities/products/Product';
import { CreateProductDto } from '../controllers/dto/products/CreateProductDto';
import { ProductStatus } from '../../domain/enums/ProductStatus';

export class ProductMapper {
  static fromDocument(doc: ProductDocument): Product {
    return new Product(
      doc.id,
      doc.shopId,
      doc.userId,
      doc.title,
      doc.description,
      doc.category,
      doc.basePrice,
      doc.origin,
      doc.photos,
      doc.attributes,
      doc.stock,
      doc.status,
      doc.shippingTime,
      doc.timeGuarantee,
    );
  }

  static fromCreateDto(dto: CreateProductDto, sellerId: string): Product {
    return new Product(
      crypto.randomUUID(),
      dto.shopId,
      sellerId,
      dto.title,
      dto.description,
      dto.category,
      dto.basePrice,
      dto.origin,
      [],
      dto.attributes,
      dto.stock,
      ProductStatus.PENDING,
      dto.shippingTime,
      dto.guarantee,
    );
  }

  static toPersistence(product: Product) {
    return {
      _id: crypto.randomUUID(),
      id: product.id,
      shopId: product.shopId,
      userId: product.userId,
      title: product.title,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice,
      origin: product.origin,
      photos: product.photos,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      attributes: product.attributes,
      stock: product.stock,
      status: product.status,
      shippingTime: product.shippingTime,
      timeGuarantee: product.timeGuarantee,
    };
  }
}

import { ProductVariantDocument } from '../persistence/productVariant.schema';
import { ProductVariant } from '../../domain/entities/products/ProductVariant';
import { CreateVariantDto } from '../controllers/dto/products/CreateVariantDto';
import { ProductStatus } from '../../domain/enums/ProductStatus';

export class ProductVariantMapper {
  static toDomain(doc: ProductVariantDocument): ProductVariant {
    return new ProductVariant(
      doc.id,
      doc.productId,
      doc.title,
      doc.description,
      doc.price,
      doc.attributes,
      doc.stock,
      doc.photos,
      doc.status,
      doc.shippingTime,
      doc.timeGuarantee,
    );
  }

  static fromDto(dto: CreateVariantDto, productId: string): ProductVariant {
    return new ProductVariant(
      crypto.randomUUID(),
      productId,
      dto.title,
      dto.description,
      dto.price,
      dto.attributes,
      dto.stock,
      [],
      ProductStatus.PUBLISHED,
      dto.shippingTime,
      dto.guarantee,
    );
  }

  static toPersistence(variant: ProductVariant) {
    return {
      _id: crypto.randomUUID(),
      id: variant.id,
      productId: variant.productId,
      title: variant.title,
      description: variant.description,
      price: variant.price,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      attributes: variant.attributes,
      stock: variant.stock,
      photos: variant.photos,
      status: variant.status,
      shippingTime: variant.shippingTime,
      timeGuarantee: variant.timeGuarantee,
    };
  }
}

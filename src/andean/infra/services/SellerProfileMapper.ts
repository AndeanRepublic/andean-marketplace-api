import { SellerDocument } from '../persistence/seller.schema';
import { SellerProfile } from '../../domain/entities/SellerProfile';

export class CustomerProfileMapper {
  static toDomain(doc: SellerDocument): SellerProfile {
    return new SellerProfile(
      doc.id,
      doc.name,
      doc.typePerson,
      doc.numberDocument,
      doc.ruc,
      doc.commercialName,
      doc.address,
      doc.phoneNumber,
    );
  }
}

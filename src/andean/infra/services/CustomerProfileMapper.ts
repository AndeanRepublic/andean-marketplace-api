import { UserDocument } from '../persistence/user.schema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';

export class CustomerProfileMapper {
  static toDomain(doc: UserDocument): CustomerProfile {
    return new CustomerProfile(
      doc.id,
      doc.name,
      doc.country,
      doc.phoneNumber,
      doc.language,
      doc.coin,
    );
  }
}

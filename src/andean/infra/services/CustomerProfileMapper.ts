import { CustomerProfileDocument } from '../persistence/customerProfileSchema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CreateCustomerDto } from '../controllers/dto/CreateCustomerDto';
import { UpdateCustomerProfileDto } from '../controllers/dto/UpdateCustomerProfileDto';

export class CustomerProfileMapper {
  static toDomain(doc: CustomerProfileDocument): CustomerProfile {
    return new CustomerProfile(
      doc.id,
      doc.userId,
      doc.name,
      doc.country,
      doc.phoneNumber,
      doc.language,
      doc.coin,
    );
  }

  static fromDto(userId: string, dto: CreateCustomerDto): CustomerProfile {
    return new CustomerProfile(
      crypto.randomUUID(),
      userId,
      dto.name,
      dto.country,
      dto.phoneNumber,
      dto.language,
      dto.coin,
    );
  }

  static fromUpdateDto(
    id: string,
    userId: string,
    dto: UpdateCustomerProfileDto,
  ) {
    return new CustomerProfile(
      id,
      userId,
      dto.name,
      dto.country,
      dto.phoneNumber,
      dto.language,
      dto.coin,
    );
  }

  static toPersistence(profile: CustomerProfile) {
    return {
      _id: crypto.randomUUID(),
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      country: profile.country,
      phoneNumber: profile.phoneNumber,
      language: profile.language,
      coin: profile.coin,
    };
  }
}

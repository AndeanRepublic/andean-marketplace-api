import { SellerProfileDocument } from '../persistence/sellerProfileSchema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../controllers/dto/CreateSellerDto';
import { UpdateSellerProfileDto } from '../controllers/dto/UpdateSellerProfileDto';

export class SellerProfileMapper {
	static fromDocument(doc: SellerProfileDocument): SellerProfile {
		return new SellerProfile(
			doc.id,
			doc.userId,
			doc.name,
			doc.typePerson,
			doc.numberDocument,
			doc.ruc,
			doc.commercialName,
			doc.address,
			doc.phoneNumber,
		);
	}

	static fromCreateDto(userId: string, dto: CreateSellerDto): SellerProfile {
		return new SellerProfile(
			crypto.randomUUID(),
			userId,
			dto.name,
			dto.typePerson,
			dto.numberDocument,
			dto.ruc ?? '',
			dto.commercialName,
			dto.address,
			dto.phoneNumber,
		);
	}

	static fromUpdateDto(
		id: string,
		userId: string,
		dto: UpdateSellerProfileDto,
	) {
		return new SellerProfile(
			id,
			userId,
			dto.name,
			dto.typePerson,
			dto.numberDocument,
			dto.ruc ?? '',
			dto.commercialName,
			dto.address,
			dto.phoneNumber,
		);
	}

	static toPersistence(profile: SellerProfile) {
		return {
			_id: crypto.randomUUID(),
			id: profile.id,
			userId: profile.userId,
			name: profile.name,
			typePerson: profile.typePerson,
			numberDocument: profile.numberDocument,
			ruc: profile.ruc,
			commercialName: profile.commercialName,
			address: profile.address,
			phoneNumber: profile.phoneNumber,
		};
	}
}

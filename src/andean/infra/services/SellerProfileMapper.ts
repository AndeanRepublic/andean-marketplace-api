import { SellerProfileDocument } from '../persistence/sellerProfileSchema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../controllers/dto/CreateSellerDto';
import { UpdateSellerProfileDto } from '../controllers/dto/UpdateSellerProfileDto';

export class SellerProfileMapper {
	static fromDocument(doc: SellerProfileDocument): SellerProfile {
		return new SellerProfile(
			doc._id.toString(),
			doc.userId,
			doc.name,
			doc.typePerson,
			doc.numberDocument,
			doc.ruc,
			doc.address,
			doc.phoneNumber,
		);
	}

	static fromCreateDto(userId: string, dto: CreateSellerDto): SellerProfile {
		// Don't set id - let MongoDB generate _id automatically
		return new SellerProfile(
			'',
			userId,
			dto.name,
			dto.typePerson,
			dto.numberDocument,
			dto.ruc ?? '',
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
			dto.address,
			dto.phoneNumber,
		);
	}

	static toPersistence(profile: SellerProfile) {
		// Remove id and _id to let MongoDB handle them automatically
		const {
			id,
			_id,
			__v,
			userId,
			name,
			typePerson,
			numberDocument,
			ruc,
			address,
			phoneNumber,
		} = profile as any;
		return {
			userId,
			name,
			typePerson,
			numberDocument,
			ruc,
			address,
			phoneNumber,
		};
	}
}

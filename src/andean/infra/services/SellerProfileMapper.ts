import { SellerProfileDocument } from '../persistence/sellerProfileSchema';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { CreateSellerDto } from '../controllers/dto/CreateSellerDto';
import { UpdateSellerProfileDto } from '../controllers/dto/UpdateSellerProfileDto';
import { SellerStatus } from '../../domain/enums/SellerStatus';
import { SellerProfileResponse } from '../../app/models/users/SellerProfileResponse';

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
			doc.status ?? SellerStatus.PENDING,
			doc.rejectionReason,
		);
	}

	static fromCreateDto(
		userId: string,
		dto: CreateSellerDto,
		status: SellerStatus = SellerStatus.PENDING,
	): SellerProfile {
		return new SellerProfile(
			'',
			userId,
			dto.name,
			dto.typePerson,
			dto.numberDocument,
			dto.ruc ?? '',
			dto.address,
			dto.phoneNumber,
			status,
		);
	}

	static fromUpdateDto(
		id: string,
		userId: string,
		dto: UpdateSellerProfileDto,
		status: SellerStatus,
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
			status,
		);
	}

	static toResponse(profile: SellerProfile): SellerProfileResponse {
		return {
			id: profile.id,
			userId: profile.userId,
			name: profile.name,
			typePerson: profile.typePerson,
			numberDocument: profile.numberDocument,
			ruc: profile.ruc,
			address: profile.address,
			phoneNumber: profile.phoneNumber,
			status: profile.status,
			rejectionReason: profile.rejectionReason,
		};
	}

	static toPersistence(profile: SellerProfile) {
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
			status,
		} = profile as SellerProfile & { _id?: unknown; __v?: unknown };
		return {
			userId,
			name,
			typePerson,
			numberDocument,
			ruc,
			address,
			phoneNumber,
			status,
			rejectionReason: profile.rejectionReason,
		};
	}
}

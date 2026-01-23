import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CustomerProfileDocument } from '../persistence/customerProfileSchema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CreateCustomerDto } from '../controllers/dto/CreateCustomerDto';
import { UpdateCustomerProfileDto } from '../controllers/dto/UpdateCustomerProfileDto';

export class CustomerProfileMapper {
	static fromDocument(doc: CustomerProfileDocument): CustomerProfile {
		const plain = doc.toObject();
		const { _id, ...rest } = plain;
		return plainToInstance(CustomerProfile, rest);
	}

	static fromCreateDto(
		userId: string,
		dto: CreateCustomerDto,
	): CustomerProfile {
		const { email, password, ...customerData } = dto;

		const plain = {
			id: crypto.randomUUID(),
			userId: userId,
			...customerData,
		};

		return plainToInstance(CustomerProfile, plain);
	}

	static fromUpdateDto(
		id: string,
		userId: string,
		dto: UpdateCustomerProfileDto,
	) {
		const { birthDate, profilePictureUrl, ...customerData } = dto;

		const plain = {
			id: id,
			userId: userId,
			...customerData,
		};

		return plainToInstance(CustomerProfile, plain);
	}

	static toPersistence(profile: CustomerProfile) {
		const plain = instanceToPlain(profile);
		return {
			_id: crypto.randomUUID(),
			...plain,
		};
	}
}

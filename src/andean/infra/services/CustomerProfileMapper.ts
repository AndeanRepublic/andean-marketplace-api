import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CustomerProfileDocument } from '../persistence/customerProfileSchema';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { CreateCustomerDto } from '../controllers/dto/CreateCustomerDto';
import { UpdateCustomerProfileDto } from '../controllers/dto/UpdateCustomerProfileDto';

export class CustomerProfileMapper {
	static fromDocument(doc: CustomerProfileDocument): CustomerProfile {
		const plain = doc.toObject();
		return plainToInstance<CustomerProfile, Record<string, any>>(
			CustomerProfile,
			{ id: plain._id.toString(), ...plain },
			{ excludeExtraneousValues: false },
		) as unknown as CustomerProfile;
	}

	static fromCreateDto(
		userId: string,
		dto: CreateCustomerDto,
	): CustomerProfile {
		const { email, password, name, birthDate, ...customerData } = dto;

		// Don't set id - let MongoDB generate _id automatically
		const plain = {
			userId: userId,
			...customerData,
			...(birthDate && { birthDate: new Date(birthDate) }),
		};

		return plainToInstance<CustomerProfile, Record<string, any>>(
			CustomerProfile,
			plain,
			{ excludeExtraneousValues: false },
		) as unknown as CustomerProfile;
	}

	static fromUpdateDto(
		id: string,
		userId: string,
		dto: UpdateCustomerProfileDto,
	) {
		const { birthDate, ...customerData } = dto;

		const plain = {
			id: id,
			userId: userId,
			...customerData,
			...(birthDate && { birthDate: new Date(birthDate) }),
		};

		return plainToInstance<CustomerProfile, Record<string, any>>(
			CustomerProfile,
			plain,
			{ excludeExtraneousValues: false },
		) as unknown as CustomerProfile;
	}

	static toPersistence(profile: CustomerProfile) {
		const plain = instanceToPlain(profile);
		// Remove id and _id to let MongoDB generate _id automatically
		const { id, _id, __v, userId, ...rest } = plain;
		return {
			userId,
			...rest,
		};
	}
}

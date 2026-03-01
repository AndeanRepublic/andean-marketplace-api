import { ShippingAddressDocument } from '../persistence/shippingAddress.schema';
import { ShippingAddress } from '../../domain/entities/ShippingAddress';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class ShippingAddressMapper {
	static fromDocument(doc: ShippingAddressDocument): ShippingAddress {
		const plain = doc.toObject();
		return plainToInstance(ShippingAddress, {
			id: plain._id.toString(),
			customerId: plain.customerId,
			recipientName: plain.recipientName,
			phone: plain.phone,
			countryCode: plain.countryCode,
			country: plain.country,
			city: plain.city,
			administrativeArea: plain.administrativeArea,
			addressLine1: plain.addressLine1,
			addressLine2: plain.addressLine2,
			postalCode: plain.postalCode,
			isDefault: plain.isDefault || false,
			createdAt: plain.createdAt,
			updatedAt: plain.updatedAt,
		});
	}

	static toPersistence(shippingAddress: ShippingAddress | Partial<ShippingAddress>) {
		const plain = instanceToPlain(shippingAddress);
		const { id, _id, __v, ...updateData } = plain;
		return {
			...updateData,
		};
	}
}

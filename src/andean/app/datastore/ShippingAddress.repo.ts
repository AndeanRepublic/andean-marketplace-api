import { ShippingAddress } from '../../domain/entities/ShippingAddress';

export abstract class ShippingAddressRepository {
	abstract create(shippingAddress: ShippingAddress): Promise<ShippingAddress>;
	abstract getById(id: string): Promise<ShippingAddress | null>;
	abstract getByCustomerId(customerId: string): Promise<ShippingAddress[]>;
	abstract update(
		id: string,
		shippingAddress: Partial<ShippingAddress>,
	): Promise<ShippingAddress>;
	abstract delete(id: string): Promise<void>;
	abstract setAsDefault(id: string, customerId: string): Promise<ShippingAddress>;
}

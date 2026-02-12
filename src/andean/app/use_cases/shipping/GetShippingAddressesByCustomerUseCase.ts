import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';

@Injectable()
export class GetShippingAddressesByCustomerUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
	) {}

	async handle(customerId: string): Promise<ShippingAddress[]> {
		// Validar que el customer existe
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}

		return this.shippingAddressRepository.getByCustomerId(customerId);
	}
}
